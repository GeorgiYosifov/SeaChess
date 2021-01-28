import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { IRouterState } from 'src/app/+store/router.index';
import * as fromGameStore from 'src/app/modules/home/components/game/+store/game.index';
import * as fromGameActions from 'src/app/modules/home/components/game/+store/game.actions';
import { environment } from 'src/environments/environment';
import { IGameIncomingInfo } from 'src/app/modules/shared/models/game/game-incoming-info';
import { IGameInfo } from 'src/app/modules/shared/models/game/game-info';
import { IPlayer } from 'src/app/modules/shared/models/game/game-player';
import { IconType } from 'src/app/modules/shared/models/game/player-icon-type';
import * as fromGameSelectors from 'src/app/modules/home/components/game/+store/game.selectors';
import { ICellView } from 'src/app/modules/shared/models/game/game-cell-view';
import { JwtHelper } from './jwtHelper';

@Injectable()
export class GameService {
    private readonly API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;
    private decodedToken: object;

    public rendererCell: Renderer2;
    public rendererBoard: Renderer2;

    constructor(private storeGame: Store<fromGameStore.IGameState>,
        private storeRouter: Store<IRouterState>) { }

    public startConnection() {
        const token = localStorage.getItem('token');
        this.decodedToken = JwtHelper.decodeToken(token);
        
        const options: IHttpConnectionOptions = {
            accessTokenFactory: () => {
                return token;
            }
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(this.API_URL + '/game', options)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection Started In Game');
                this.getGameInfo();
            })
            .catch(err => console.log('Error while starting connection in game: ' + err));
    }

    public getGameInfo() {
        let gameId: string;

        this.storeRouter.subscribe((data) => {
            gameId = data.router.state.queryParams['gameId'];
        }).unsubscribe();

        this.hubConnection.invoke('GetGameInfo', gameId)
            .then((gameIncomingInfo: IGameIncomingInfo) => {
                const gameInfo: IGameInfo = Object.assign({
                    id: gameIncomingInfo.id,
                    playerOnTurn: gameIncomingInfo.firstPlayer.id,
                    turn: 1
                });

                gameIncomingInfo.firstPlayer.iconType = IconType.Cross;
                gameIncomingInfo.firstPlayer.movements = [];
                gameIncomingInfo.secondPlayer.iconType = IconType.Circle;
                gameIncomingInfo.secondPlayer.movements = [];
                const players: IPlayer[] = [ gameIncomingInfo.firstPlayer, gameIncomingInfo.secondPlayer ];

                this.storeGame.dispatch(new fromGameActions.LoadGameInfoSuccess(gameInfo));
                this.storeGame.dispatch(new fromGameActions.LoadPlayersSuccess(players));
            })
            .catch(err => console.log('Error Get Players Info: ' + err));
    }

    public selectUsedCells(): { [iconType: string]: ICellView[] } {
        let cells: { [iconType: string]: ICellView[] } = {};

        this.storeGame.select(fromGameSelectors.getGameUsedCells).subscribe((data: ICellView[]) => {
            cells['Cross'] = data.filter(c => c.iconType == IconType.Cross);
            cells['Circle'] = data.filter(c => c.iconType == IconType.Circle);
        }).unsubscribe();
        
        return cells;
    }

    public markCell(id: string): { isMarked: boolean, iconType: IconType } {
        let iconType: IconType;
        let isMarked = true;
        this.storeGame.select(fromGameSelectors.getGamePlayerOnTurnInfo).subscribe((data: IPlayer) => {
            if (!data.movements.find(m => m.id == id)) {
                isMarked = false;
                iconType = data.iconType;

                let entities: IPlayer[];
                this.storeGame.select(fromGameSelectors.getGamePlayersEntities).subscribe((data: IPlayer[]) => {
                    entities = data;
                }).unsubscribe();

                const dataToMakeCell = Object.assign({
                    markCellId: id,
                    playerOnTurnId: data.id,
                    entities: entities
                });
                this.storeGame.dispatch(new fromGameActions.MarkCell(dataToMakeCell));
            }
        }).unsubscribe();
        return { isMarked, iconType };
    }

    public setPlayerAbilities(cells: ElementRef[]) {
        this.storeGame.select(fromGameSelectors.getGameInfo).subscribe((data: IGameInfo) => {
            const userId = this.decodedToken['id'];
            if (data.playerOnTurn != userId) {
                cells.forEach((cell: ElementRef) => {
                    this.rendererCell.addClass(cell, 'noClick');
                });
            } else {
                cells.forEach((cell: ElementRef) => {
                    this.rendererCell.removeClass(cell, 'noClick');
                });
            }
        });
    }

    public endConnection() {
        this.hubConnection
            .stop()
            .then(() => console.log('Connection Stopped In Game'))
            .catch(err => console.log('Error while stopping connection in game: ' + err));
    }
}
