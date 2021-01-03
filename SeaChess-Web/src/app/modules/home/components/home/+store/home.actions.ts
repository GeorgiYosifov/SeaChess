import { IAction } from '../../../../shared/action';
import { IUser } from '../../../../shared/models/user-home';

export const ActionTypes = {
    LoadUsers: '[Home] Load Users',
    LoadUsersSuccess: '[Home] Load Users Success',
    LoadUsersFailed: '[Home] Load Users Failed',
    ChangeUserStatus: '[Home] Change User Status',
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

export class ChangeUserStatus implements IAction<{ userId: string, status: string }> {
    type = ActionTypes.ChangeUserStatus;
    constructor(public payload: { userId: string, status: string }) { }
}

export class RemoveUser implements IAction<string> {
    type = ActionTypes.RemoveUser;
    constructor(public payload: string) { }
}

export type Actions = LoadUsers | LoadUsersSuccess | LoadUsersFailed | ChangeUserStatus | RemoveUser;