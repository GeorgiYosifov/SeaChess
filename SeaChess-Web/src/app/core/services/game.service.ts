import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { IRouterState } from 'src/app/+store/router.index';
import * as fromGameStore from 'src/app/modules/home/components/game/+store/game.index';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
    private API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;

    constructor(private gameState: Store<fromGameStore.IGameState>,
        private routerState: Store<IRouterState>) { }

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
                this.GetPlayersInfo();
            })
            .catch(err => console.log('Error while starting connection in game: ' + err));
    }

    public GetPlayersInfo() {
        let gameId: string;

        this.routerState.subscribe((data) => {
            gameId = data.router.state.queryParams['gameId'];
        }).unsubscribe();

        this.hubConnection.invoke('GetPlayersInfo', gameId)
                    .then((_) => console.log('Get Players Info'))
                    .catch(err => console.log('Error Get Players Info: ' + err));
    }

    public endConnection() {
        this.hubConnection
            .stop()
            .then(() => console.log('Connection Stopped In Game'))
            .catch(err => console.log('Error while stopping connection in game: ' + err));
    }
}
