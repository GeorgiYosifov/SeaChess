import { IAction } from '../../../../shared/action';
import { IUser } from '../../../../shared/models/home/user-home';

export const ActionTypes = {
    LoadUsers: '[Home] Load Users',
    LoadUsersSuccess: '[Home] Load Users Success',
    LoadUsersFailed: '[Home] Load Users Failed',
    RemoveUser: '[Home] Remove User'
};

export class LoadUsers implements IAction<null> {
    readonly type = ActionTypes.LoadUsers;
    constructor(public payload: null) { }
}

export class LoadUsersSuccess implements IAction<IUser[]> {
    type = ActionTypes.LoadUsersSuccess;
    constructor(public payload: IUser[]) { }
}

export class LoadUsersFailed implements IAction<{ error: any }> {
    type = ActionTypes.LoadUsersFailed;
    constructor(public payload: { error: any }) { }
}

export class RemoveUser implements IAction<string> {
    type = ActionTypes.RemoveUser;
    constructor(public payload: string) { }
}

export type Actions = LoadUsers | LoadUsersSuccess | LoadUsersFailed | RemoveUser;