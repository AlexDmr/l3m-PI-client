import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    const currentPath = activatedRoute.url.pipe(
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
    console.log(msl, msl.options[0].value);
    this.goto([msl.options[0].value]);
  }

  private goto(path: string[]): void {
    this.router.navigate(path);
  }
}
