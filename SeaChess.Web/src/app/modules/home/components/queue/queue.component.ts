import { Component, HostListener, OnInit } from '@angular/core';
import { QueueService } from 'src/app/core/services/queue.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  constructor(public queueService: QueueService) { }

  ngOnInit() {
    this.queueService.startConnection();
    this.queueService.addSendUsersToGameListener();
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.queueService.endConnection();
  }
}