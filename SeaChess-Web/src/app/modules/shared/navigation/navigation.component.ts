import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(public authService: AuthService,
    private router: Router) { }

  logout() {
    this.authService.logout();
    //Implement in logout() not here
    this.router.navigate([ '/identity/login' ]);
  }  
}