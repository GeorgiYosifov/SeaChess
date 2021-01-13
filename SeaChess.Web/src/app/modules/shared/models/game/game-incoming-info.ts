import { IPlayer } from "./game-player";

export interface IGameIncomingInfo {
    id: string;
    firstPlayer: IPlayer;
    secondPlayer: IPlayer;
}