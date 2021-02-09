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
import { JwtHelper } from './jwtHelper';
import { ICell } from 'src/app/modules/shared/models/game/game-cell';
import { IChangeTurnInfo } from 'src/app/modules/shared/models/game/change-turn-info';
import { BoardComponent } from 'src/app/modules/home/components/game/board/board.component';

@Injectable()
export class GameService {
    private readonly API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;
    private decodedToken: object;

    public rendererCell: Renderer2;
    public rendererBoard: Renderer2;

    constructor(public storeGame: Store<fromGameStore.IGameState>,
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
                this.createGroup();
                this.getGameInfo();
            })
            .catch(err => console.log('Error while starting connection in game: ' + err));
    }

    public addYourTurnListener(board: BoardComponent) {
        this.hubConnection.on('YourTurn', (changeTurnInfo: IChangeTurnInfo) => {    
            this.changeGameInfo(changeTurnInfo);
            this.uploadEnemyMovements(changeTurnInfo);
            board.selectEnemyCells();
        });
    }

    public markCell(id: string): { iconType: IconType } {
        let iconType: IconType = IconType.None;
        let isMarked: boolean = true;
        let playerForNextTurn: IPlayer;
        let playerOnTurnId: string;
        this.storeGame.select(fromGameSelectors.getGamePlayerOnTurnInfo).subscribe((data: IPlayer) => {
            if (!data.movements.find(m => m.id == id)) {
                playerOnTurnId = data.id;      
                isMarked = false;
                iconType = data.iconType;

                let entities: IPlayer[];
                this.storeGame.select(fromGameSelectors.getGamePlayersEntities).subscribe((data: IPlayer[]) => {
                    entities = data;
                }).unsubscribe();

                playerForNextTurn = entities.filter(e => e.id != playerOnTurnId)[0];
                const dataToMarkCell = Object.assign({
                    markCellId: id,
                    playerOnTurnId: playerOnTurnId,
                    entities: entities
                });
                this.storeGame.dispatch(new fromGameActions.MarkCell(dataToMarkCell));
            }
        }).unsubscribe();
    
        if (!isMarked) {
            let playerOnTurnMovements: ICell[];
            this.storeGame.select(fromGameSelectors.getGamePlayerOnTurnInfo).subscribe((data: IPlayer) => {
                playerOnTurnMovements = data.movements; 
            }).unsubscribe();

            let dataToChangeTurn: IChangeTurnInfo = {
                gameId: this.getGameId(),
                turn: null,
                playerOnNextTurnId: playerForNextTurn.id,
                playerOnTurnId: playerOnTurnId,
                playerOnTurnMovements: playerOnTurnMovements
            };
            dataToChangeTurn = this.changeGameInfo(dataToChangeTurn);

            this.hubConnection.invoke('ChangeTurn', dataToChangeTurn)
                    .then((_) => console.log('Change Turn Successfully'))
                    .catch(err => console.log('Error Change Turn: ' + err));
        }

        return { iconType }
    }

    public setPlayerAbilities(cells: ElementRef[]) {
        this.storeGame.select(fromGameSelectors.getGameInfo).subscribe((data: IGameInfo) => {
            const userId = this.decodedToken['id'];
            if (data.playerOnTurnId != userId) {
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

    private createGroup() {
        const gameId: string = this.getGameId();

        this.hubConnection.invoke('CreateGroup', gameId)
            .then((_) => console.log('Create Group Successfully'))
            .catch(err => console.log('Error Create Group: ' + err));;
    }

    private getGameInfo() {
        let gameId: string = this.getGameId();

        this.hubConnection.invoke('GetGameInfo', gameId)
            .then((gameIncomingInfo: IGameIncomingInfo) => {
                const gameInfo: IGameInfo = {
                    id: gameIncomingInfo.id,
                    playerOnTurnId: gameIncomingInfo.firstPlayer.id,
                    turn: 1
                };

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

    private getGameId(): string {
        let gameId: string;

        this.storeRouter.subscribe((data) => {
            gameId = data.router.state.queryParams['gameId'];
        }).unsubscribe();

        return gameId;
    }

    private changeGameInfo(dataToChangeTurn: IChangeTurnInfo): IChangeTurnInfo {
        if (!dataToChangeTurn.turn) {
            this.storeGame.select(fromGameSelectors.getGameInfo).subscribe((gameInfo: IGameInfo) => {
                dataToChangeTurn.turn = gameInfo.turn;
            }).unsubscribe();
        }

        const dataToModifyGameInfo: IGameInfo = {
            id: dataToChangeTurn.gameId,
            playerOnTurnId: dataToChangeTurn.playerOnNextTurnId,
            turn: dataToChangeTurn.turn
        };
    
        this.storeGame.dispatch(new fromGameActions.ChangeGameInfoOnTurn(dataToModifyGameInfo));
        return dataToChangeTurn;
    }

    private uploadEnemyMovements(changeTurnInfo: IChangeTurnInfo) {
        const dataToUploadEnemyMovements: { playerId: string, movements: ICell[] } = {
            playerId: changeTurnInfo.playerOnTurnId,
            movements: changeTurnInfo.playerOnTurnMovements
        };

        this.storeGame.dispatch(new fromGameActions.UploadEnemyMovements(dataToUploadEnemyMovements));
    }
}
