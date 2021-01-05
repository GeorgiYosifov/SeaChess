import { IGameInfo } from "src/app/modules/shared/models/game-info";
import * as fromGameActions from "./game.actions";

export interface IInfoState {
    id: string;
    playerOnTurn: string;
}

const defaultState: IInfoState = {
    id: '',
    playerOnTurn: ''
};

export function infoReducer(state: IInfoState = defaultState, action: fromGameActions.Actions): IInfoState {
    if (action.type === fromGameActions.ActionTypes.LoadGameInfoSuccess) {
        const info: IGameInfo = (action as fromGameActions.LoadGameInfoSuccess).payload;
        const id = info.id;
        const playerOnTurn = info.playerOnTurn;

        return { ...state, id, playerOnTurn };
    }

    return state;
}