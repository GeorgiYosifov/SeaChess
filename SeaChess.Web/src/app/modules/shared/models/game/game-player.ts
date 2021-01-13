import { CellType } from "./game-cell-type";
import { ICell } from "./game-cell";

export interface IPlayer {
    id: string;
    email: string;
    score: number;
    cellType: CellType;
    movements: ICell[];
    //[{ [cellId: string]: ICell; }];
}