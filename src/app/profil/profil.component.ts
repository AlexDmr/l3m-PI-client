import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
