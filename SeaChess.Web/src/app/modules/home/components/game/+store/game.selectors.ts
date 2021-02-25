import { createSelector } from "@ngrx/store";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { IPlayerStat } from "src/app/modules/shared/models/game/player-stat";
import { getGameState, IGameState } from "./game.index";

const getInfo = (state: IGameState): IGameInfo => state.info;
const getPlayersEntities = (state: IGameState): IPlayer[] => state.players.entities;
const getPlayerOnTurnInfo = (gameInfo: IGameInfo, entities: IPlayer[]): IPlayer => {
    const playerOnTurnId = gameInfo.playerOnTurnId;
    return entities.find(e => e.id == playerOnTurnId);
}
const getPlayerOnTurnTime = (player: IPlayer): { playerId: string, time: number } => {
    return { playerId: player.id, time: player.time } 
}
const getPlayersStat = (gameInfo: IGameInfo, entities: IPlayer[]): IPlayerStat[] => {
    if (entities.length == 0)
        return [];

    const firstPlayer = entities[0];
    const secondPlayer = entities[1];
    const playerOnTurnId = gameInfo.playerOnTurnId;
    
    const firstPlayerStat: IPlayerStat = {
        id: firstPlayer.id,
        email: firstPlayer.email,
        score: firstPlayer.score,
        isOnTurn: firstPlayer.id == playerOnTurnId,
        iconType: firstPlayer.iconType,
        time: firstPlayer.time
    };
    const secondPlayerStat: IPlayerStat = {
        id: secondPlayer.id,
        email: secondPlayer.email,
        score: secondPlayer.score,
        isOnTurn: secondPlayer.id == playerOnTurnId,
        iconType: secondPlayer.iconType,
        time: secondPlayer.time
    };

    return [ firstPlayerStat, secondPlayerStat ];
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayersEntities = createSelector(getGameState, getPlayersEntities);
export const getGamePlayerOnTurnInfo = createSelector(getGameInfo, getGamePlayersEntities, getPlayerOnTurnInfo);
export const getGamePlayerOnTurnTime = createSelector(getGamePlayerOnTurnInfo, getPlayerOnTurnTime);
export const getGamePlayersStat = createSelector(getGameInfo, getGamePlayersEntities, getPlayersStat);
