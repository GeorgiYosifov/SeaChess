import { IMovement } from "./player-movement";

export interface IPlayer {
    id: string;
    email: string;
    score: number;
    movements: IMovement[];
}