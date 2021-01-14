import { ShiftHelper } from "src/app/core/services/shiftHelper";
import { ICell } from "src/app/modules/shared/models/game/game-cell";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
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
        let data: { markCellId: string, playerOnTurnId: string, entities: IPlayer[] } 
            = (action as fromGameActions.MarkCell).payload;

        let entities = data.entities;
        let movements: ICell[] = Object.assign([], entities.find(e => e.id == data.playerOnTurnId).movements);
        
        let markCell: ICell = {
            id: data.markCellId,
            alreadyInPoint: false
        };

        //check top left diagonal
        let markedCells: ICell[] = [markCell];
        for (let i = 0; i < 3; i++) {
            let currentMarkedCell: ICell = markedCells[markedCells.length - 1];

            let newCellId: string = shiftToFindNewCell(currentMarkedCell.id, ShiftHelper.leftTopRow, ShiftHelper.leftTopCol);
            let newCell: ICell = movements.find(m => m.id == newCellId && m.alreadyInPoint == false);
            if (newCell != null) {
                markedCells.push(newCell);
            } else {
                markedCells = [markCell];
                break;
            }
        }

        //need TODO
        if (markedCells.length == 4) {
            //markedCells.map(m => m.alreadyInPoint = true);
            movements.push(markCell);
            markedCells.forEach(c => {
                movements.find(m => m.id == c.id).alreadyInPoint = true; 
            });

            entities.find(e => e.id == data.playerOnTurnId).movements = movements;
            return { ...state, entities };
        } else {
            //fix this assignment
            movements.push(markCell);
            entities.find(e => e.id == data.playerOnTurnId).movements = Object.assign([], movements);
            return { ...state, entities };
        }
    }

    return state;
}

function shiftToFindNewCell(cellId: string, shiftRow: number, shiftCol: number): string {
    let cellRow = cellId[0];
    let cellCol = cellId[1];

    let shiftCellRow: string = (Number(cellRow) + shiftRow).toString();
    let shiftCellCol: string = String.fromCharCode((cellCol.charCodeAt(0) + shiftCol));
    let shiftCell: string = shiftCellRow + shiftCellCol;
    return shiftCell;
}
