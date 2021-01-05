import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { QueueComponent } from './components/queue/queue.component';
import { StoreModule } from '@ngrx/store';
import { reducersHome } from './components/home/+store/home.index';
import { HomeRoutingModule } from './home-routing.module';
import { GameComponent } from './components/game/game.component';
import { reducersGame } from './components/game/+store/game.index';
//import { GameModule } from './components/game/game.module';

@NgModule({
  declarations: [
      HomeComponent,
      QueueComponent,
      GameComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    //GameModule,
    StoreModule.forFeature('home', reducersHome),
    StoreModule.forFeature('game', reducersGame)
  ]
})
export class HomeModule { }
