import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IUserRegister } from 'src/app/modules/shared/models/auth/user-register';
import { IUserLogin } from 'src/app/modules/shared/models/auth/user-login';
import { IAuthSuccess } from 'src/app/modules/shared/models/auth/auth-success';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private API_URL = environment.API_URL;
  private readonly loginUrl = this.API_URL + '/api/v1/identity/login';
  private readonly registerUrl = this.API_URL + '/api/v1/identity/register';

  constructor(private http: HttpClient,
    private router: Router) { }

  register(body: IUserRegister): Observable<IAuthSuccess> {
    return this.http.post<IAuthSuccess>(this.registerUrl, body);
  }

  login(body: IUserLogin): Observable<IAuthSuccess> {
    return this.http.post<IAuthSuccess>(this.loginUrl, body);
  }

  logout() {
    localStorage.clear();
    this.router.navigate([ '/identity/login' ]);
  }

  isAuthenticated(): Boolean {
    return this.getToken() !== null;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }
}