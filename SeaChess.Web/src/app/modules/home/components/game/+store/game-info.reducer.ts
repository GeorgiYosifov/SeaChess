import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import * as fromGameActions from "./game.actions";

export interface IInfoState {
    id: string;
    playerOnTurn: string;
    turn: number;
}

const defaultState: IInfoState = {
    id: '',
    playerOnTurn: '',
    turn: 0
};

export function infoReducer(state: IInfoState = defaultState, action: fromGameActions.Actions): IInfoState {
    if (action.type === fromGameActions.ActionTypes.LoadGameInfoSuccess) {
        const info: IGameInfo = (action as fromGameActions.LoadGameInfoSuccess).payload;
        const id = info.id;
        const playerOnTurn = info.playerOnTurn;
        const turn = info.turn;

        return { ...state, id, playerOnTurn, turn };
    }

    return state;
}