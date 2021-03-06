import { ShiftHelper } from "src/app/core/services/shiftHelper";
import { ICell } from "src/app/modules/shared/models/game/game-cell";
import { IMarkCell } from "src/app/modules/shared/models/game/game-mark-cell";
import { IPlayer } from "src/app/modules/shared/models/game/game-player";
import { IShift } from "src/app/modules/shared/models/game/game-shift";
import { IUploadEnemyInfo } from "src/app/modules/shared/models/game/upload-enemy-info";
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
        const data: IMarkCell = (action as fromGameActions.MarkCell).payload;
        const markCell: ICell = {
            id: data.markCellId,
            alreadyInPoint: false
        };

        const playerOnTurn: IPlayer = data.entities.find(e => e.id == data.playerOnTurnId);
        const playerNotOnTurn: IPlayer = data.entities.find(e => e.id != data.playerOnTurnId);

        let playerOnTurnCopy: IPlayer = Object.assign({
            ...playerOnTurn,
            movements: Object.assign([], playerOnTurn.movements)
        });
        playerOnTurnCopy.movements.push(markCell);

        let estimatedPoint = false;
        for (let index = 0; index < 4; index++) {
            estimatedPoint = tryToApplyPointOnDiagonalCells(markCell, playerOnTurnCopy, ShiftHelper.diagonals[index]);
            if (estimatedPoint) break; 
        }
        
        const entities = keepOrderInEntities(state.entities, playerOnTurnCopy, playerNotOnTurn);
        return { ...state, entities };
    } else if (action.type === fromGameActions.ActionTypes.UploadEnemyInfo) {
        const data: IUploadEnemyInfo = (action as fromGameActions.UploadEnemyInfo).payload;

        const current: IPlayer = state.entities.find(e => e.id != data.id);
        let enemy: IPlayer = state.entities.find(e => e.id == data.id);
        enemy = { ...enemy, score: data.score, movements: data.movements, time: data.time }; 

        const entities = keepOrderInEntities(state.entities, current, enemy);
        return { ...state, entities };
    } else if (action.type === fromGameActions.ActionTypes.UpdatePlayerTime) {
        const data: { id: string, time: number } = (action as fromGameActions.UpdatePlayerTime).payload;

        let current: IPlayer = state.entities.find(e => e.id == data.id);
        current = { ...current, time: data.time };
        const enemy: IPlayer = state.entities.find(e => e.id != data.id);

        const entities = keepOrderInEntities(state.entities, current, enemy);
        return { ...state, entities };
    }

    return state;
}

function keepOrderInEntities(entities: IPlayer[], current: IPlayer, enemy: IPlayer) {
    let result: IPlayer[] = [null, null];
    const currentIndex = entities.findIndex(e => e.id == current.id);
    const enemyIndex = entities.findIndex(e => e.id == enemy.id);
    result[currentIndex] = current;
    result[enemyIndex] = enemy;
    return result;
}

// Go through specific diagonal and search if the current cell has related cells
function tryToApplyPointOnDiagonalCells(markCell: ICell, playerOnTurnCopy: IPlayer, shift: IShift): boolean {

    let relatedTopCells: ICell[] = findRelatedCells(markCell, playerOnTurnCopy.movements, shift.top.row, shift.top.col);
    let relatedBottomCells: ICell[] = findRelatedCells(markCell, playerOnTurnCopy.movements, shift.bottom.row, shift.bottom.col);

    let relatedCells: ICell[];
    if (relatedTopCells.length + relatedBottomCells.length - 1 >= 4) {
        //remove duplicated cell
        relatedBottomCells.splice(relatedBottomCells.indexOf(markCell), 1);
        relatedCells = [ ...relatedTopCells, ...relatedBottomCells ];
        changeRelatedCellsToUnusable(relatedCells, playerOnTurnCopy);
        playerOnTurnCopy.score++;
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

function changeRelatedCellsToUnusable(relatedCells: ICell[], playerOnTurnCopy: IPlayer) {
    let tempMovements = playerOnTurnCopy.movements.map(m => {
        if (relatedCells.find(c => c.id == m.id)) {
            return Object.assign({ ...m, alreadyInPoint: true });
        } else {
            return m
        }
    });

    playerOnTurnCopy.movements = Object.assign(tempMovements);
}
