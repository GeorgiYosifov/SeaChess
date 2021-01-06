import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { GameComponent } from './game.component';
import { reducersGame } from './+store/game.index';
import { GameService } from 'src/app/core/services/game.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: GameComponent }
]

@NgModule({
  declarations: [
    GameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('game', reducersGame)
  ],
  providers: [
    GameService
  ]
})
export class GameModule { }