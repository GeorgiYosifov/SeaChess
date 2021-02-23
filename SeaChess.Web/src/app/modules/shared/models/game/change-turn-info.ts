import { IPlayer } from "./game-player";

export interface IChangeTurnInfo {
    gameId: string;
    turn: number;
    isIncreasedScore: boolean;
    playerOnTurn: IPlayer;
    playerOnNextTurnId: string;
}