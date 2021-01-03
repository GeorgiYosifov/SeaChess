import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromUsersCounter from './home-counter.reducer';
import * as fromUsers from './home.reducer';

export interface IHomeState {
    users: fromUsers.IUsersState;
    counter: fromUsersCounter.IUsersCountState;
}

export const reducersHome: ActionReducerMap<IHomeState> = {
    users: fromUsers.usersReducer,
    counter: fromUsersCounter.countReducer
};

export const getHomeState = createFeatureSelector<IHomeState>('home');
