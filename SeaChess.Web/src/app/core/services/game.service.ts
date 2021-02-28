import { Injectable, Renderer2 } from '@angular/core';
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
import { IChangeTurnInfo } from 'src/app/modules/shared/models/game/change-turn-info';
import { BoardComponent } from 'src/app/modules/home/components/game/board/board.component';
import { IUploadEnemyInfo } from 'src/app/modules/shared/models/game/upload-enemy-info';
import { ICellView } from 'src/app/modules/shared/models/game/game-cell-view';
import { ICell } from 'src/app/modules/shared/models/game/game-cell';
import { StatsComponent } from 'src/app/modules/home/components/game/stats/stats.component';

@Injectable()
export class GameService {
    private readonly API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;
    private decodedToken: object;
    private board: BoardComponent;
    private stats: StatsComponent;

    public rendererCell: Renderer2;
    public rendererBoard: Renderer2;

    constructor(public storeGame: Store<fromGameStore.IGameState>,
        private storeRouter: Store<IRouterState>) { }

    public attachReferencesOfComponents(board: BoardComponent, stats: StatsComponent) {
        this.board = board;
        this.stats = stats;
    }

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

    public addYourTurnListener() {
        this.hubConnection.on('YourTurn', (changeTurnInfo: IChangeTurnInfo) => { 
            this.stats.stopTimer.value = true;
            //this.stats.setEachPlayerTimer(false);

            this.changeGameInfo(changeTurnInfo);
            this.uploadEnemyInfo(changeTurnInfo);
            this.markEnemyLastMovement(changeTurnInfo);
            if (changeTurnInfo.isIncreasedScore) {
                this.board.printPoint(changeTurnInfo.pointCells);
            }
            this.stats.uploadPlayersStat();
        });
    }

    public markCell(id: string): IconType {      
        let iconType: IconType = IconType.None;
        let alreadyCalled = false;

        this.storeGame.select(fromGameSelectors.getGamePlayerOnTurnInfo).subscribe((playerOnTurn: IPlayer) => {
            const userId = this.decodedToken['id'];

            if (userId == playerOnTurn.id && !playerOnTurn.movements.find(m => m.id == id) && !alreadyCalled) {
                alreadyCalled = true;
                this.updatePlayerTime(playerOnTurn.id);
                this.stats.stopTimer.value = true;

                let entities: IPlayer[];
                this.storeGame.select(fromGameSelectors.getGamePlayersEntities).subscribe((data: IPlayer[]) => {
                    entities = data;
                }).unsubscribe();

                const dataToMarkCell = Object.assign({
                    markCellId: id,
                    playerOnTurnId: playerOnTurn.id,
                    entities: entities
                });
                this.storeGame.dispatch(new fromGameActions.MarkCell(dataToMarkCell));
                
                let isIncreasedScore: boolean = false;
                let pointCells: ICellView[] = [];
                let playerOnTurnAfterMarking: IPlayer;
                this.storeGame.select(fromGameSelectors.getGamePlayerOnTurnInfo).subscribe((data: IPlayer) => {
                    playerOnTurnAfterMarking = data;
                    iconType = data.iconType;
                    if (playerOnTurn.score + 1 == playerOnTurnAfterMarking.score) {
                        isIncreasedScore = true;
                        pointCells = this.getCellsForNewPoint(playerOnTurn.movements, playerOnTurnAfterMarking.movements, playerOnTurn.iconType);
                    }
                }).unsubscribe();
                let playerForNextTurnId: string = entities.filter(e => e.id != playerOnTurn.id)[0].id; 

                let dataToChangeTurn: IChangeTurnInfo = {
                    gameId: this.getGameId(),
                    turn: null,
                    isIncreasedScore,
                    pointCells,
                    playerOnTurn: playerOnTurnAfterMarking,
                    playerOnNextTurnId: playerForNextTurnId
                };
                dataToChangeTurn = this.changeGameInfo(dataToChangeTurn);

                this.hubConnection.invoke('ChangeTurn', dataToChangeTurn)
                    .then((_) => { 
                        console.log('Change Turn Successfully');
                        //this.stats.stopTimer.value = false;
                        this.stats.setEachPlayerTimer(false);
                        this.stats.changeBackgroundColor(false);
                    })
                    .catch(err => console.log('Error Change Turn: ' + err));
            }
        }).unsubscribe();

        return iconType;
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

                this.stats.uploadPlayersStat();
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

    private uploadEnemyInfo(changeTurnInfo: IChangeTurnInfo) {
        const dataToUploadEnemyInfo: IUploadEnemyInfo = {
            id: changeTurnInfo.playerOnTurn.id,
            score: changeTurnInfo.playerOnTurn.score,
            movements: changeTurnInfo.playerOnTurn.movements,
            time: changeTurnInfo.playerOnTurn.time
        };

        this.storeGame.dispatch(new fromGameActions.UploadEnemyInfo(dataToUploadEnemyInfo));
    }

    private markEnemyLastMovement(changeTurnInfo: IChangeTurnInfo) {
        let movements = changeTurnInfo.playerOnTurn.movements;
        let lastMovement: ICell = movements[movements.length - 1] ?? null;
        if (lastMovement == null)
            return;
        
        let cell: ICellView = {
            id: lastMovement.id,
            iconType: changeTurnInfo.playerOnTurn.iconType
        };
        this.board.printEnemyLastMovement(cell);
    }

    private getCellsForNewPoint(movements: ICell[], movementsAfterMarking: ICell[], iconType: IconType): ICellView[] {
        let pointCells: ICellView[] = [];
        for (let i = 0; i < movements.length; i++) {
            if (movements[i].alreadyInPoint != movementsAfterMarking[i].alreadyInPoint) {
                const cell: ICellView = { id: movementsAfterMarking[i].id, iconType };
                pointCells.push(cell);
            }
        }
        const lastMarkedCell: ICell = movementsAfterMarking[movementsAfterMarking.length - 1];
        const cell: ICellView = { id: lastMarkedCell.id, iconType };
        pointCells.push(cell);

        this.board.printPoint(pointCells);
        return pointCells;
    }

    private updatePlayerTime(playerId: string) {
        let playerOnTurnTime: number;
        if (playerId == this.stats.firstPlayer.id) {
            playerOnTurnTime = this.stats.firstPlayer.time;
        } else if (playerId = this.stats.secondPlayer.id) {
            playerOnTurnTime = this.stats.secondPlayer.time;
        }

        const dataToUpdatePlayerTime: { id: string, time: number } = {
            id: playerId,
            time: playerOnTurnTime
        }
        this.storeGame.dispatch(new fromGameActions.UpdatePlayerTime(dataToUpdatePlayerTime));
    }
}
