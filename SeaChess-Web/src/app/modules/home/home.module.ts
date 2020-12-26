import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { QueueComponent } from './components/queue/queue.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './components/+store/home.index';
import { HomeRoutingModule } from './home-routing.module';
import { GameComponent } from './components/game/game.component';

@NgModule({
  declarations: [
      HomeComponent,
      QueueComponent,
      GameComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    StoreModule.forFeature('home', reducers)
  ]
})
export class HomeModule { }
