export class ShiftHelper {
    //left diagonal
    static readonly leftTopRow = 1;
    static readonly leftTopCol = -1;
    static readonly leftBottomRow = -1;
    static readonly leftBottomCol = 1;

    //vertical diagonal
    static readonly verticalTopRow = 1;
    static readonly verticalTopCol = 0;
    static readonly verticalBottomRow = -1;
    static readonly verticalBottomCol = 0;

    //right diagonal
    static readonly rightTopRow = 1;
    static readonly rightTopCol = 1;
    static readonly rightBottomRow = -1;
    static readonly rightBottomCol = -1;
    
    //horizontal diagonal, top -> right, bottom -> left
    static readonly horizontalTopRow = 0;
    static readonly horizontalTopCol = 1;
    static readonly horizontalBottomRow = 0;
    static readonly horizontalBottomCol = -1;
}