import { IAction } from 'src/app/modules/shared/action';
import { IAuthSuccess } from 'src/app/modules/shared/models/auth/auth-success';
import { IUserLogin } from 'src/app/modules/shared/models/auth/user-login';
import { IUserRegister } from 'src/app/modules/shared/models/auth/user-register';

export const ActionTypes = {
  Register: '[AUTH] Register',
  RegisterSuccess: '[AUTH] Register Success',
  RegisterFailed: '[AUTH] Register Failed',

  Login: '[AUTH] Login',
  LoginSuccess: '[AUTH] Login Success',
  LoginFailed: '[AUTH] Login Failed',

  Logout: '[AUTH] Logout',
  LogoutSuccess: '[AUTH] Logout Success',
  LogoutFailed: '[AUTH] Logout Failed',

  SetToken: '[AUTH] Set Token'
};

export class Register implements IAction<IUserRegister> {
  type = ActionTypes.Register;
  constructor(public payload: IUserRegister) { }
}

export class RegisterSuccess implements IAction<IAuthSuccess> {
  type = ActionTypes.RegisterSuccess;
  constructor(public payload: IAuthSuccess) { }
}

export class RegisterFailed implements IAction<{ error: any }> {
  type = ActionTypes.RegisterFailed;
  constructor(public payload: { error: any }) { }
}

export class Login implements IAction<IUserLogin> {
  type = ActionTypes.Login;
  constructor(public payload: IUserLogin) { }
}

export class LoginSuccess implements IAction<IAuthSuccess> {
  type = ActionTypes.LoginSuccess;
  constructor(public payload: IAuthSuccess) { }
}

export class LoginFailed implements IAction<{ error: any }> {
  type = ActionTypes.LoginFailed;
  constructor(public payload: { error: any }) { }
}

export class Logout implements IAction<null> {
  type = ActionTypes.Logout;
  constructor(public payload: null = null) { }
}

export class LogoutSuccess implements IAction<null> {
  type = ActionTypes.LogoutSuccess;
  constructor(public payload: null = null) { }
}

export class LogoutFailed implements IAction<{ error: any }> {
  type = ActionTypes.LogoutFailed;
  constructor(public payload: { error: any }) { }
}

export class SetToken implements IAction<{ token: string }> {
  type = ActionTypes.SetToken;
  constructor(public payload: { token: string }) { }
}

export type Actions = Register |
  RegisterSuccess |
  RegisterFailed |
  Login |
  LoginSuccess |
  LoginFailed | SetToken;
