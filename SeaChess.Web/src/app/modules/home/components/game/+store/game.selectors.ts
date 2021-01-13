import { createSelector } from "@ngrx/store";
import { ICellView } from "src/app/modules/shared/models/game/game-cell-view";
import { getGameState, IGameState } from "./game.index";

export const getInfo = (state: IGameState) => state.info;
export const getPlayers = (state: IGameState) => state.players;
export const getUsedCells = (state: IGameState) => {
    let movements: ICellView[];
    state.players.players.forEach(p => {
        const cellType = p.cellType;
        p.movements.forEach(m => {
            movements.push(Object.assign({
                id: m.id,
                type: cellType,
                alreadyInPoint: m.alreadyInPoint
            }));
        });
    });
    return movements;
}

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayers = createSelector(getGameState, getPlayers);
export const getGameUsedCells = createSelector(getGameState, getUsedCells);