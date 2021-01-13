export interface ICell {
    id: string;
    leftDiagonal: string[];
    rightDiagonal: string[];
    verticalDiagonal: string[];
    horizontalDiagonal: string[];
    alreadyInPoint: boolean; //Already used and also marked not to be count for new Point to PlayerScore
    //isUsed: boolean;
}