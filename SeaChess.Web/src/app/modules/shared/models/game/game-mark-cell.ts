import { IPlayer } from "./game-player";

export interface IMarkCell {
    markCellId: string;
    playerOnTurnId: string;
    entities: IPlayer[];
}