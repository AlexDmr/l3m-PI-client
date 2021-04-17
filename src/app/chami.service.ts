import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, multicast, refCount, tap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

export interface Chami {
  login: string;
  age: number;
}

export interface User {
  uAuth: firebase.User;
  chami: Chami | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ChamiService {
  private chamiSubj = new Subject<Chami>();
  readonly user: Observable<User | undefined>;
  private jwt = '';

  constructor(private http: HttpClient, private auth: AngularFireAuth) {
    const url = environment.serveurMetierURL;
    const U = auth.user;
    const C: Observable<Chami | undefined> = U.pipe(
      tap( () => this.jwt = '' ),
      filter( u => !!u),
      map( u => u as firebase.User ),
      mergeMap( async u => {
        this.jwt = await u.getIdToken();
        return u;
      }),
      mergeMap( async (u: firebase.User) => {
        const login = u.email;
        try {
          const R = await this.get<Chami>(`${url}/api/chamis/${login}`);
          return R.status === 200 ? (R.body ?? undefined) : undefined;
        } catch (err) {
          return undefined;
        }
      })
    );

    const upChami = merge(this.chamiSubj, C);

    this.user = combineLatest([U, upChami]).pipe(
      map( ([uAuth, chami]) => {
        if (!uAuth) {
          return undefined;
        } else {
          return {uAuth, chami};
        }
      } ),
      multicast( () => new BehaviorSubject<User | undefined>(undefined) ),
      refCount()
    );
  }

  async updateChami(login: string, chami: Chami): Promise<Chami | null> {
    const url = environment.serveurMetierURL;
    const R = await this.put<Chami>( `${url}/api/chamis/${login}`, chami );
    this.chamiSubj.next( R.status === 200 ? R.body as Chami : undefined );
    return R.body;
  }

  login(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    this.auth.signInWithPopup(provider);
  }

  logout(): void {
    this.auth.signOut();
  }

  private async get<T>(url: string): Promise<HttpResponse<T>> {
    return this.http.get<T>( url, {observe: 'response', headers: {Authorization: this.jwt}} ).toPromise();
  }

  private async post<T>(url: string, body: object): Promise<HttpResponse<T>> {
    return this.http.post<T>( url, body, {observe: 'response', headers: {Authorization: this.jwt}} ).toPromise();
  }

  private async put<T>(url: string, body: object): Promise<HttpResponse<T>> {
    return this.http.put<T>( url, body, {observe: 'response', headers: {Authorization: this.jwt}} ).toPromise();
  }

  private async delete<T>(url: string): Promise<HttpResponse<T>> {
    return this.http.delete<T>( url, {observe: 'response', headers: {Authorization: this.jwt}} ).toPromise();
  }
}
