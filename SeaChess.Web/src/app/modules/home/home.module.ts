import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { QueueComponent } from './components/queue/queue.component';
import { StoreModule } from '@ngrx/store';
import { reducersHome } from './components/home/+store/home.index';
import { HomeRoutingModule } from './home-routing.module';
import { HomeService } from 'src/app/core/services/home.service';
import { QueueService } from 'src/app/core/services/queue.service';

@NgModule({
  declarations: [
      HomeComponent,
      QueueComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    StoreModule.forFeature('home', reducersHome)
  ],
  providers: [ 
    HomeService,
    QueueService
  ]
})
export class HomeModule { }
