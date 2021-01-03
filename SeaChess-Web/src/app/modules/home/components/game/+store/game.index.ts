import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import { IPlayersState, playersReducer } from './game-players.reducer';
import { gameInfoReducer, IGameInfoState } from './game.reducer';

export interface IGameState {
    gameInfo: IGameInfoState;
    players: IPlayersState;
}

export const reducersGame: ActionReducerMap<IGameState> = {
    gameInfo: gameInfoReducer,
    players: playersReducer
};

export const getGameState = createFeatureSelector<IGameState>('game');