import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(module => module.HomeModule)
  },
  {
    path: 'identity',
    loadChildren: () => import('./modules/authentication/auth.module').then(module => module.AuthModule)
  },
  { 
    path: 'home/game',
    loadChildren: () => import('./modules/home/components/game/game.module').then(module => module.GameModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
