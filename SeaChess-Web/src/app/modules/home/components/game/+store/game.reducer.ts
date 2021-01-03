import * as fromGameActions from "./game.actions";

export interface IGameInfoState {
    id: string;
}

const defaultState: IGameInfoState = {
    id: '',
};

export function gameInfoReducer(state: IGameInfoState = defaultState, action: fromGameActions.Actions): IGameInfoState {
    // if (action.type === fromGameActions.ActionTypes.LoadPlayersSuccess) {
    //     const players: IPlayer[] = (action as fromGameActions.LoadPlayersSuccess).payload;

    //     return { ...state, players };
    // }

    return state;
}