import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import * as fromGameActions from "./game.actions";

export interface IPlayersState {
    players: IPlayer[];
}

const defaultState: IPlayersState = {
    players: [],
};

export function playersReducer(state: IPlayersState = defaultState, action: fromGameActions.Actions): IPlayersState {
    if (action.type === fromGameActions.ActionTypes.LoadPlayersSuccess) {
        const players: IPlayer[] = (action as fromGameActions.LoadPlayersSuccess).payload;

        return { ...state, players };
    }

    return state;
}