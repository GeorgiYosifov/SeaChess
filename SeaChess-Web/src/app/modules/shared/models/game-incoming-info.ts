import { IPlayer } from "./player-game";

export interface IGameIncomingInfo {
    id: string;
    firstPlayer: IPlayer;
    secondPlayer: IPlayer;
}