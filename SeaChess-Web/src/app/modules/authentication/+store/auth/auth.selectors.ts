import { createSelector } from '@ngrx/store';
import { getAuthStore, IAuthState } from '../auth.index';
import { IState } from './auth.reducer';

export const getState = (state: IAuthState) => state.auth;
export const getToken = (state: IState) => state.token;
export const getErrorMessage = (state: IState) => state.errorMessage;

export const getAuthState = createSelector(getAuthStore, getState);
export const getAuthToken = createSelector(getAuthState, getToken);
export const getAuthErrorMessage = createSelector(getAuthState, getErrorMessage);
export const getIsAuthenticated = createSelector(getAuthState, token => !!token);