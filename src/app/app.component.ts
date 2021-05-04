import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { ChamiService, User } from './chami.service';

interface StateRoot {
  user: User | undefined;
  route: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  dataIconGoogle = 'assets/images/iconGoogle.png';
  readonly state: Observable<StateRoot>;

  constructor(private cs: ChamiService, private activatedRoute: ActivatedRoute, private router: Router) {
    const currentPath = this.router.events.pipe(
      filter( event => event instanceof NavigationEnd ),
      map( () => this.activatedRoute ),
      map(route => {
        while (route.firstChild) {
         route = route.firstChild;
        }
        return route;
       }),
       mergeMap(route => route.url),
       map( L => L.map( frag => frag.path ).join('/') )
    );

    this.state = combineLatest([cs.user, currentPath]).pipe(
      map( ([user, route]) => ({user, route}) )
    );
  }

  login(): void {
    this.cs.login();
  }

  logout(): void {
    this.cs.logout();
  }

  changeRoute(msl: MatSelectionListChange): void {
    this.router.navigate([msl.options[0].value]);
  }

}
