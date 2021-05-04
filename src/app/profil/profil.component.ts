import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chami, ChamiService, fakeChami } from '../chami.service';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  chami: Chami = fakeChami();

  constructor(public cs: ChamiService) {
    this.sub = cs.user.subscribe(
      u => {
        if (!!u?.chami) {
          this.chami = u.chami;
        } else {
          this.chami = fakeChami();
          this.chami.login = u?.uAuth?.email ?? '';
        }
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  update(login: string): void {
    // console.log(login);
    console.log( this.chami );
    this.cs.createChami( login, this.chami );
  }
}
