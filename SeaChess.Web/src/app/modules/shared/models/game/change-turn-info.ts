import { ICellView } from "./game-cell-view";
import { IPlayer } from "./game-player";

export interface IChangeTurnInfo {
    gameId: string;
    turn: number;
    isIncreasedScore: boolean;
    pointCells: ICellView[];
    playerOnTurn: IPlayer;
    playerOnNextTurnId: string;
}