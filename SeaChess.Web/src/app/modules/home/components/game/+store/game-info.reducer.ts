import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import * as fromGameActions from "./game.actions";

export interface IInfoState {
    id: string;
    playerOnTurnId: string;
    turn: number;
}

const defaultState: IInfoState = {
    id: '',
    playerOnTurnId: '',
    turn: 0
};

export function infoReducer(state: IInfoState = defaultState, action: fromGameActions.Actions): IInfoState {
    if (action.type === fromGameActions.ActionTypes.LoadGameInfoSuccess) {
        const info: IGameInfo = (action as fromGameActions.LoadGameInfoSuccess).payload;
        const id = info.id;
        const playerOnTurnId = info.playerOnTurnId;
        const turn = info.turn;

        return { ...state, id, playerOnTurnId, turn };
    } else if (action.type === fromGameActions.ActionTypes.ChangeGameInfoOnTurn) {
        const info: IGameInfo = (action as fromGameActions.ChangeGameInfoOnTurn).payload;
        const playerOnTurnId = info.playerOnTurnId;
        const turn = info.turn;

        return { ...state, playerOnTurnId, turn };
    }

    return state;
}