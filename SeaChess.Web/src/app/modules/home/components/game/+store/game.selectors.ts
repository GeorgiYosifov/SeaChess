import { createSelector } from "@ngrx/store";
import { ICellView } from "src/app/modules/shared/models/game/game-cell-view";
import { IGameInfo } from "src/app/modules/shared/models/game/game-info";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { getGameState, IGameState } from "./game.index";

export const getInfo = (state: IGameState): IGameInfo => state.info;
export const getPlayersEntities = (state: IGameState): IPlayer[] => state.players.entities;
export const getUsedCells = (players: IPlayer[]): ICellView[] => {
    let movements: ICellView[];
    players.forEach(p => {
        const iconType = p.iconType;
        p.movements.forEach(m => {
            movements.push(Object.assign({
                id: m.id,
                iconType: iconType,
                alreadyInPoint: m.alreadyInPoint
            }));
        });
    });
    return movements;
}
export const getPlayerOnTurnInfo = (state: IGameState): IPlayer => {
    const playerOnTurnId = state.info.playerOnTurn;
    return state.players.entities.find(e => e.id == playerOnTurnId);
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayersEntities = createSelector(getGameState, getPlayersEntities);
export const getGameUsedCells = createSelector(getGamePlayersEntities, getUsedCells);
export const getGamePlayerOnTurnInfo = createSelector(getGameState, getPlayerOnTurnInfo);