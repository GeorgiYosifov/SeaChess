import { createSelector } from "@ngrx/store";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { IPlayerStat } from "src/app/modules/shared/models/game/player-stat";
import { getGameState, IGameState } from "./game.index";

const getInfo = (state: IGameState): IGameInfo => state.info;
const getPlayersEntities = (state: IGameState): IPlayer[] => state.players.entities;
const getPlayerOnTurnInfo = (state: IGameState): IPlayer => {
    const playerOnTurnId = state.info.playerOnTurnId;
    return state.players.entities.find(e => e.id == playerOnTurnId);
}
const getPlayersStat = (state: IGameState): IPlayerStat[] => {
    if (state.players.entities.length == 0)
        return [];

    const firstPlayer = state.players.entities[0];
    const secondPlayer = state.players.entities[1];
    const playerOnTurnId = state.info.playerOnTurnId;
    
    const firstPlayerStat: IPlayerStat = {
        email: firstPlayer.email,
        score: firstPlayer.score,
        isOnTurn: firstPlayer.id == playerOnTurnId,
        iconType: firstPlayer.iconType
    };
    const secondPlayerStat: IPlayerStat = {
        email: secondPlayer.email,
        score: secondPlayer.score,
        isOnTurn: secondPlayer.id == playerOnTurnId,
        iconType: secondPlayer.iconType
    };

    return [ firstPlayerStat, secondPlayerStat ];
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayersEntities = createSelector(getGameState, getPlayersEntities);
export const getGamePlayerOnTurnInfo = createSelector(getGameState, getPlayerOnTurnInfo);
export const getGamePlayersStat = createSelector(getGameState, getPlayersStat);
