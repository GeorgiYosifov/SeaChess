export interface IUsersCountState {
    count: number;
}

const defaultState: IUsersCountState = {
    count: 0,
};

export function countReducer(state: IUsersCountState = defaultState, action: any) {
    return state;
}