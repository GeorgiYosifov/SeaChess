import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IRouterState } from 'src/app/+store/router.index';
import * as fromHomeStore from 'src/app/modules/home/components/+store/home.index';
import * as fromHomeSelector from 'src/app/modules/home/components/+store/home.selectors';
import { IUser } from 'src/app/modules/shared/models/user-home';
import { environment } from 'src/environments/environment';
import { go } from '@ngrx/router-store';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
    private API_URL = environment.API_URL;
    private hubConnection: signalR.HubConnection;
    public users$: Observable<IUser[]>;

    constructor(private storeHome: Store<fromHomeStore.IHomeState>,
        private storeRoute: Store<IRouterState>) { }

    public startConnection() {
        const token = localStorage.getItem('token');

        const options: IHttpConnectionOptions = {
            accessTokenFactory: () => {
                return token;
            }
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(this.API_URL + '/matchMaker', options)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection Started In Queue');
                this.sendUsersToBackEnd();
            })
            .catch(err => console.log('Error while starting connection in queue: ' + err));
    }

    public sendUsersToBackEnd() {
        this.users$.subscribe(data => {
            if (data.length != 0) {
                this.hubConnection.invoke('SendedUsersFromState', data)
                    .then((_) => console.log('Send Users To MatchMaker'))
                    .catch(err => console.log('Error Send Users: ' + err));
            }
        }).unsubscribe();
    }

    public selectUsers() {
        this.users$ = this.storeHome.select(fromHomeSelector.getQueueUsers);
    }

    public addSendUsersToGameListener() {
        this.hubConnection.on('SendUsersToGame', () => {
            this.storeRoute.dispatch(go(['/home/game']));
        });
    }

    public endConnection() {
        this.hubConnection
            .stop()
            .then(() => console.log('Connection Stopped In Queue'))
            .catch(err => console.log('Error while stopping connection in queue: ' + err));
    }
}