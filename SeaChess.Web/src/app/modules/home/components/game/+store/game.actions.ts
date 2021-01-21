import { IAction } from "src/app/modules/shared/action";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IMarkCell } from "src/app/modules/shared/models/game/game-mark-cell";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";

export const ActionTypes = {
    LoadPlayers: '[Game] Load Players',
    LoadPlayersSuccess: '[Game] Load Players Success',
    LoadPlayersFailed: '[Game] Load Players Failed',
    LoadGameInfoSuccess: '[Game] Load Game Info Success',
    MarkCell: '[Game] Mark Cell'
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

export class LoadGameInfoSuccess implements IAction<IGameInfo> {
    type = ActionTypes.LoadGameInfoSuccess;
    constructor(public payload: IGameInfo) { }
}

export class MarkCell implements IAction<IMarkCell> {
    type = ActionTypes.MarkCell;
    constructor(public payload: IMarkCell) { }
}

export type Actions = LoadPlayers | LoadPlayersSuccess | LoadPlayersFailed | LoadGameInfoSuccess | MarkCell;
