import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '', loadChildren: './modules/home/home.module#HomeModule'  },
  { path: '', loadChildren: './modules/authentication/auth.module#AuthModule' }
  //{ path: 'register', loadChildren: './modules/authentication/auth.module#AuthModule' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
