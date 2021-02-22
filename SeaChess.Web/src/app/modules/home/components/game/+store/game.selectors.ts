import { createSelector } from "@ngrx/store";
import { ICell } from "src/app/modules/shared/models/game/game-cell";
import { ICellView } from "src/app/modules/shared/models/game/game-cell-view";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { IPlayerStat } from "src/app/modules/shared/models/game/player-stat";
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
export const getPlayersStat = (state: IGameState): IPlayerStat[] => {
    if (state.players.entities.length == 0) {
        return [];
    }

    const firstPlayer = state.players.entities[0];
    const secondPlayer = state.players.entities[1];
    const playerOnTurnId = state.info.playerOnTurnId;
    
    const firstPlayerStat: IPlayerStat = {
        email: firstPlayer.email,
        score: firstPlayer.score,
        isOnTurn: firstPlayer.id == playerOnTurnId
    };
    const secondPlayerStat: IPlayerStat = {
        email: secondPlayer.email,
        score: secondPlayer.score,
        isOnTurn: secondPlayer.id == playerOnTurnId
    };

    return [ firstPlayerStat, secondPlayerStat ];
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayersEntities = createSelector(getGameState, getPlayersEntities);
export const getGamePlayerOnTurnInfo = createSelector(getGameState, getPlayerOnTurnInfo);
export const getGameEnemyPlayerLastMovement = createSelector(getGameState, getEnemyPlayerLastMovement);
export const getGamePlayersStat = createSelector(getGameState, getPlayersStat);
