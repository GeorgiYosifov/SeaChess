import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers } from './+store/auth.index';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './+store/auth/auth.effects';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forFeature('credentials', reducers),
    EffectsModule.forFeature([
      AuthEffects
    ])
  ]
})
export class AuthModule { }
