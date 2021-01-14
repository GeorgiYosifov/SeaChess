import { Component, HostListener } from '@angular/core';
import { HomeService } from 'src/app/core/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  constructor(public homeService: HomeService) { }

  ngOnInit() {
    this.homeService.startConnection();
    this.homeService.addSendUsersListener();
  }

  ngOnDestroy() {
    this.beforeUnload();
  }

  @HostListener('window:beforeunload')
  private beforeUnload() {
    this.homeService.endConnection();
  }
}
