import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { IState, authReducer } from './auth/auth.reducer';
import { environment } from 'src/environments/environment';
//import { storeFreeze } from 'ngrx-store-freeze';

//export const metaReducers: MetaReducer<IAuthState>[] = !environment.production ? [storeFreeze] : [];

export interface IAuthState {
    auth: IState;
};

export const reducers: ActionReducerMap<IAuthState> = {
    auth: authReducer
};

export const getAuthStore = createFeatureSelector<IAuthState>('credentials');