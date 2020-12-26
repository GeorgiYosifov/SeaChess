import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from './router.reducer';
import * as fromRouter from '@ngrx/router-store';

export interface IRouterState {
    router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const routerReducers: ActionReducerMap<IRouterState> = {
    router: fromRouter.routerReducer
};

export const getRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('router');
