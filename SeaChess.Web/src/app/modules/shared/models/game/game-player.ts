import { IconType } from "./player-icon-type";
import { ICell } from "./game-cell";

export interface IPlayer {
    id: string;
    email: string;
    score: number;
    iconType: IconType;
    movements: ICell[];
    time: number; // ms
}