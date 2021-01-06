import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { IRouterState } from 'src/app/+store/router.index';
import * as fromGameStore from 'src/app/modules/home/components/game/+store/game.index';
import * as fromGameActions from 'src/app/modules/home/components/game/+store/game.actions';
import { environment } from 'src/environments/environment';
import { IGameIncomingInfo } from 'src/app/modules/shared/models/game-incoming-info';
import { IGameInfo } from 'src/app/modules/shared/models/game-info';
import { IPlayer } from 'src/app/modules/shared/models/player-game';

@Injectable()
export class GameService {
    private API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;

    constructor(private storeGame: Store<fromGameStore.IGameState>,
        private storeRouter: Store<IRouterState>) { }

    public startConnection() {
        const token = localStorage.getItem('token');

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
                this.GetGameInfo();
            })
            .catch(err => console.log('Error while starting connection in game: ' + err));
    }

    public GetGameInfo() {
        let gameId: string;

        this.storeRouter.subscribe((data) => {
            gameId = data.router.state.queryParams['gameId'];
        }).unsubscribe();

        this.hubConnection.invoke('GetGameInfo', gameId)
                    .then((gameIncomingInfo: IGameIncomingInfo) => {
                        const gameInfo: IGameInfo = Object.assign({
                            id: gameIncomingInfo.id,
                            playerOnTurn: gameIncomingInfo.firstPlayer.id
                        });
                        const players: IPlayer[] = [ gameIncomingInfo.firstPlayer, gameIncomingInfo.secondPlayer ];

                        this.storeGame.dispatch(new fromGameActions.LoadGameInfoSuccess(gameInfo));
                        this.storeGame.dispatch(new fromGameActions.LoadPlayersSuccess(players));
                    })
                    .catch(err => console.log('Error Get Players Info: ' + err));
    }

    public endConnection() {
        this.hubConnection
            .stop()
            .then(() => console.log('Connection Stopped In Game'))
            .catch(err => console.log('Error while stopping connection in game: ' + err));
    }
}
