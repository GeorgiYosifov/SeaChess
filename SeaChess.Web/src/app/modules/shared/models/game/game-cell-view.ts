import { IconType } from "./player-icon-type";

export interface ICellView {
    id: string;
    iconType: IconType;
    alreadyInPoint: boolean; //Already used and also marked not to be count for new Point to PlayerScore
}