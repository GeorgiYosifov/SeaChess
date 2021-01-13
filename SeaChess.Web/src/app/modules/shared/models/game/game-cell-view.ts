import { CellType } from "./game-cell-type";

export interface ICellView {
    id: string;
    type: CellType;
    alreadyInPoint: boolean; //Already used and also marked not to be count for new Point to PlayerScore
}