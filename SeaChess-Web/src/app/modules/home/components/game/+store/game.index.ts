import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { IInfoState, infoReducer } from './game-info.reducer';
import { IPlayersState, playersReducer } from './game-players.reducer';

export interface IGameState {
    info: IInfoState;
    players: IPlayersState;
}

export const reducersGame: ActionReducerMap<IGameState> = {
    info: infoReducer,
    players: playersReducer
};

export const getGameState = createFeatureSelector<IGameState>('game');