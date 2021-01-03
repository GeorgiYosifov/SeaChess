import { createSelector } from "@ngrx/store";
import { getGameState, IGameState } from "./game.index";

export const getInfo = (state: IGameState) => state.gameInfo;
export const getPlayers = (state: IGameState) => state.players;

export const getGameInfo = createSelector(getGameState, getInfo);
export const getGamePlayers = createSelector(getGameState, getPlayers);