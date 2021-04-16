import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { OSM_TILE_LAYER_URL } from '@yaga/leaflet-ng2';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';
  tileLayerUrl: string = OSM_TILE_LAYER_URL;
  userToken = new BehaviorSubject<string>('');

  constructor(public auth: AngularFireAuth) {
    auth.user.subscribe( async u => {
      const token = !u ? '' : await u.getIdToken();
      console.log(token);
      this.userToken.next( token );
    });
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

  async query(method: string = 'GET', URL: string = 'http://localhost:5000/test/auth'): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', this.userToken.value);
    const R = await fetch(URL, {method, headers, mode: 'cors'} );
    if (R.status === 200) {
      console.log( await R.text() );
    } else {
      console.log('ERROR', R.status);
    }
  }
}
