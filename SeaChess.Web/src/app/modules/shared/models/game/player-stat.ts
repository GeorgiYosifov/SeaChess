import { IconType } from "./player-icon-type";

export interface IPlayerStat {
    id: string;
    email: string;
    score: number;
    isOnTurn: boolean;
    iconType: IconType;
    time: number; //seconds
}