import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'profil', component: ProfilComponent },
  { path: '**',   redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
