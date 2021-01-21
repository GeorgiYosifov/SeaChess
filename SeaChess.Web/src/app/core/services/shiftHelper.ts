import { IShift } from "src/app/modules/shared/models/game/game-shift";

export class ShiftHelper {
    //left diagonal
    static readonly left: IShift = {
        top: {
            row: 1,
            col: -1
        },
        bottom: {
            row: -1,
            col: 1
        }
    };


    //vertical diagonal
    static readonly vertical: IShift = {
        top: {
            row: 1,
            col: 0
        },
        bottom: {
            row: -1,
            col: 0
        }
    };

    //right diagonal
    static readonly right: IShift = {
        top: {
            row: 1,
            col: 1
        },
        bottom: {
            row: -1,
            col: -1
        }
    };
    
    //horizontal diagonal, top -> right, bottom -> left
    static readonly horizontal: IShift = {
        top: {
            row: 0,
            col: 1
        },
        bottom: {
            row: 0,
            col: -1
        }
    };

    static readonly diagonals: IShift[] = [ ShiftHelper.left, ShiftHelper.vertical, ShiftHelper.right, ShiftHelper.horizontal ];
}