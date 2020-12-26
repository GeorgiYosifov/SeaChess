import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromActions from '../auth/auth.actions';
import { AuthService } from 'src/app/core/services/auth.service';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IAuthSuccess } from 'src/app/modules/shared/models/auth-success';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {
  
  constructor(private actions$: Actions, private authService: AuthService, private router: Router) { }

  @Effect() 
  init$ = this.actions$.pipe(
    ofType('@ngrx/effects/init'),
    switchMap(() => {
    const token = localStorage.getItem('token');
    if (!token) { return []; }
    return [new fromActions.SetToken({ token })];
  }));

  @Effect() 
  login$ = this.actions$.pipe(
    ofType<fromActions.Login>(fromActions.ActionTypes.Login),
    map(action => action.payload),
    switchMap(data => {
      return this.authService.login(data).pipe(
        map((response: IAuthSuccess) => {
          return new fromActions.LoginSuccess(response);
        }),
        tap(({ payload: { token } }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['home']);
        }),
        catchError((err) => [new fromActions.LoginFailed({ error: err.error })])
      );
    })
  );

  @Effect() 
  register$ = this.actions$.pipe(
    ofType<fromActions.Register>(fromActions.ActionTypes.Register),
    map(action => action.payload),
    switchMap(data => {
      return this.authService.register(data).pipe(
        map((response: IAuthSuccess) => {
          return new fromActions.RegisterSuccess(response);
        }),
        tap(_ => {
          this.router.navigate(['login']);
        }),
        catchError((err) => [new fromActions.RegisterFailed({ error: err.error })])
      );
    })
  );

  // @Effect() 
  // logout$ = this.actions$.pipe(
  //   ofType(ActionTypes.Logout),
  //   switchMap(() => this.authService.logout().pipe(
  //     map(() => new LogoutSuccess()),
  //     tap(() => {
  //       localStorage.clear();
  //       this.router.navigate(['/login']);
  //     }),
  //     catchError((error) => [new LoginFailed({ error })])
  //   ))
  // );
}
