import { createSelector } from '@ngrx/store';
import * as fromRoot from 'src/app/+store/router.index';
import { IUser } from 'src/app/modules/shared/models/home/user-home';
import * as fromStore from './home.index';
import { IUsersState } from './home.reducer';


export const getState = (state: fromStore.IHomeState) => state.users;
export const getUsers = (state: IUsersState) => [ ...state.active, ...state.queue, ...state.game ];
export const getUsersForQueue = (users: IUsersState, router): IUser[] => {
    return router.state.url
        && router.state.url === '/home/queue'
        && users.queue
};

export const getHomeState = createSelector(fromStore.getHomeState, getState);
export const getHomeUsers = createSelector(getHomeState, getUsers);
export const getQueueUsers = createSelector(getHomeState, fromRoot.getRouterState, getUsersForQueue);