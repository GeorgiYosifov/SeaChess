import { IconType } from "./player-icon-type";

export interface IPlayerStat {
    email: string;
    score: number;
    isOnTurn: boolean;
    iconType: IconType;
}