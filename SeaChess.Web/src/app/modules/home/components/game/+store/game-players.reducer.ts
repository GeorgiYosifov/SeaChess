import { ShiftHelper } from "src/app/core/services/shiftHelper";
import { ICell } from "src/app/modules/shared/models/game/game-cell";
import { IMarkCell } from "src/app/modules/shared/models/game/game-mark-cell";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { IShift } from "src/app/modules/shared/models/game/game-shift";
import * as fromGameActions from "./game.actions";

export interface IPlayersState {
    entities: IPlayer[];
}

const defaultState: IPlayersState = {
    entities: [],
};

export function playersReducer(state: IPlayersState = defaultState, action: fromGameActions.Actions): IPlayersState {
    if (action.type === fromGameActions.ActionTypes.LoadPlayersSuccess) {
        const entities: IPlayer[] = (action as fromGameActions.LoadPlayersSuccess).payload;

        return { ...state, entities };
    } else if (action.type === fromGameActions.ActionTypes.MarkCell) {
        let data: IMarkCell = (action as fromGameActions.MarkCell).payload;

        let movements: ICell[] = Object.assign([], data.entities.find(e => e.id == data.playerOnTurnId).movements);
        let markCell: ICell = {
            id: data.markCellId,
            alreadyInPoint: false
        };

        movements.push(markCell);

        let isApplied = false;
        for (let index = 0; index < 4; index++) {
            isApplied = tryToApplyPointOnDiagonalCells(markCell, movements, ShiftHelper.diagonals[index]);
            if (isApplied) break; 
        }
        
        let playerOnTurn = data.entities.find(e => e.id == data.playerOnTurnId);
        let playerNotOnTurn = data.entities.find(e => e.id != data.playerOnTurnId);

        //NEED TO FIX REFERENCE ON MOVEMENTS
        let entities: IPlayer[];
        if (isApplied) {
            entities = [ playerNotOnTurn, Object.assign({
                ...playerOnTurn, movements, score: playerNotOnTurn.score + 1
            }) ];
        } else {
            entities = [ playerNotOnTurn, Object.assign({
                ...playerOnTurn, movements
            }) ];
        }
        
        return { ...state, entities };
    }

    return state;
}

// Go through specific diagonal and search if the current cell has related cells
function tryToApplyPointOnDiagonalCells(markCell: ICell, movements: ICell[], shift: IShift): boolean {

    let relatedTopCells: ICell[] = findRelatedCells(markCell, movements, shift.top.row, shift.top.col);
    let relatedBottomCells: ICell[] = findRelatedCells(markCell, movements, shift.bottom.row, shift.bottom.col);

    let relatedCells: ICell[];
    if (relatedTopCells.length + relatedBottomCells.length - 1 >= 4) {
        let differenceInCounts = Math.abs(relatedTopCells.length - relatedBottomCells.length);
        relatedCells = [ ...relatedTopCells, ...relatedBottomCells.splice(0, differenceInCounts) ];
        changeRelatedCellsToUnusable(relatedCells, movements);
        return true;
    }
    return false;
}

function findRelatedCells(markCell: ICell, movements: ICell[], shiftRow: number, shiftCol: number): ICell[] {
    let relatedCells: ICell[] = [ markCell ];
    for (let i = 0; i < 3; i++) {
        let currentMarkedCell: ICell = relatedCells[relatedCells.length - 1];

        let newCellId: string = shiftToFindNewCell(currentMarkedCell.id, shiftRow, shiftCol);
        let newCell: ICell = movements.find(m => m.id == newCellId && m.alreadyInPoint == false);
        if (newCell != null) {
            relatedCells.push(newCell);
        } else {
            break;
        }
    }

    return relatedCells;
}

function shiftToFindNewCell(cellId: string, shiftRow: number, shiftCol: number): string {
    let cellRow = cellId[0];
    let cellCol = cellId[1];

    let shiftCellRow: string = (Number(cellRow) + shiftRow).toString();
    let shiftCellCol: string = String.fromCharCode((cellCol.charCodeAt(0) + shiftCol));
    let shiftCell: string = shiftCellRow + shiftCellCol;
    return shiftCell;
}

function changeRelatedCellsToUnusable(relatedCells: ICell[], movements: ICell[]) {
    let tempMovements = movements.map(m => {
        if (relatedCells.find(c => c.id == m.id)) {
            return Object.assign({ ...m, alreadyInPoint: true });
        } else {
            return m
        }
    });

    movements = Object.assign(tempMovements);
}
