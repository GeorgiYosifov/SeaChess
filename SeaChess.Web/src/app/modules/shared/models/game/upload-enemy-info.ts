import { ICell } from "./game-cell";

export interface IUploadEnemyInfo {
    id: string;
    score: number;
    movements: ICell[]; 
}