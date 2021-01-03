import { IAction } from "src/app/modules/shared/action";
import { IPlayer } from "src/app/modules/shared/models/player-game";

export const ActionTypes = {
    LoadPlayers: '[Game] Load Players',
    LoadPlayersSuccess: '[Game] Load Players Success',
    LoadPlayersFailed: '[Game] Load Players Failed'
};

export class LoadPlayers implements IAction<null> {
    readonly type = ActionTypes.LoadPlayers;
    constructor(public payload: null) { }
}

export class LoadPlayersSuccess implements IAction<IPlayer[]> {
    type = ActionTypes.LoadPlayersSuccess;
    constructor(public payload: IPlayer[]) { }
}

export class LoadPlayersFailed implements IAction<{ error: any }> {
    type = ActionTypes.LoadPlayersFailed;
    constructor(public payload: { error: any }) { }
}

export type Actions = LoadPlayers | LoadPlayersSuccess | LoadPlayersFailed;