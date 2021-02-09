import { createSelector } from "@ngrx/store";
import { ICell } from "src/app/modules/shared/models/game/game-cell";
import { ICellView } from "src/app/modules/shared/models/game/game-cell-view";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { getGameState, IGameState } from "./game.index";

export const getInfo = (state: IGameState): IGameInfo => state.info;
export const getPlayersEntities = (state: IGameState): IPlayer[] => state.players.entities;
export const getPlayerOnTurnInfo = (state: IGameState): IPlayer => {
    const playerOnTurnId = state.info.playerOnTurnId;
    return state.players.entities.find(e => e.id == playerOnTurnId);
}
export const getEnemyPlayerLastMovement = (state: IGameState): ICellView => {
    const playerOnTurnId = state.info.playerOnTurnId;
    const enemy = state.players.entities.find(e => e.id != playerOnTurnId) ?? null;
    const lastMovement: ICell = enemy?.movements[enemy.movements.length - 1];
    const result: ICellView = {
        id: lastMovement.id,
        iconType: enemy.iconType,
        alreadyInPoint: lastMovement.alreadyInPoint
    };
    return result;
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayersEntities = createSelector(getGameState, getPlayersEntities);
export const getGamePlayerOnTurnInfo = createSelector(getGameState, getPlayerOnTurnInfo);
export const getGameEnemyPlayerLastMovement = createSelector(getGameState, getEnemyPlayerLastMovement);