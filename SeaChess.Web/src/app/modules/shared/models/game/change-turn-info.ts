import { ICell } from "./game-cell";

export interface IChangeTurnInfo {
    gameId: string;
    turn: number;
    playerOnNextTurnId: string;
    playerOnTurnId: string;
    playerOnTurnMovements: ICell[];
}