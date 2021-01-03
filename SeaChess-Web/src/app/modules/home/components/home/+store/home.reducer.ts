import { IUser } from '../../../../shared/models/user-home';
import * as fromHomeActions from './home.actions';

export interface IUsersState {
    active: IUser[];
    queue: IUser[];
    game: IUser[];
}

const defaultState: IUsersState = {
    active: [],
    queue: [],
    game: []
};

export function usersReducer(state: IUsersState = defaultState, action: fromHomeActions.Actions): IUsersState {
    if (action.type === fromHomeActions.ActionTypes.LoadUsersSuccess) {
        const users: IUser[] = (action as fromHomeActions.LoadUsersSuccess).payload;
        const active: IUser[] = users.filter(u => u.status === 'Active');
        const queue: IUser[] = users.filter(u => u.status === 'Queue');
        const game: IUser[] = users.filter(u => u.status === 'Game');

        return { ...state, active, queue, game };

    } else if (action.type === fromHomeActions.ActionTypes.RemoveUser) {
        const userId: string = (action as fromHomeActions.RemoveUser).payload;
        const active: IUser[] = state.active.filter(u => u.id !== userId);
        const queue: IUser[] = state.queue.filter(u => u.id !== userId);

        return { ...state, active, queue };
    }

    return state;
}

// if (action.type === fromHomeActions.ActionTypes.ChangeUserStatus) {
//     const payload: { userId: string, status: string } = (action as fromHomeActions.ChangeUserStatus).payload;
//     const userId: string = payload.userId;
//     const status: string = payload.status;

//     let user: IUser = state.active.find(u => u.id === userId);
//     if (user != null) {
//         user.status = status;
//     }
//     const queue: IUser[] = [...state.queue, user];
//     const active: IUser[] = [...state.active.filter(u => u.id !== userId)];

//     return { ...state, active, queue };
// } 