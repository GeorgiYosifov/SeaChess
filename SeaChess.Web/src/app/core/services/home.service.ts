import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { IHttpConnectionOptions } from '@aspnet/signalr';
import { IUser } from 'src/app/modules/shared/models/home/user-home';
import { JwtHelper } from './jwtHelper';
import { Store } from '@ngrx/store';
import { IHomeState } from 'src/app/modules/home/components/home/+store/home.index';
import * as fromHomeActions from '../../modules/home/components/home/+store/home.actions';
import { Observable, Subscription } from 'rxjs';
import * as fromHomeSelector from '../../modules/home/components/home/+store/home.selectors';
import { getRouterState, IRouterState } from 'src/app/+store/router.index';
import { QueueService } from './queue.service';

@Injectable()
export class HomeService {
    private readonly API_URL = environment.API_URL;
    private decodedToken: object;
    private hubConnection: signalR.HubConnection;
    private routerSubscription: Subscription;

    public users$: Observable<IUser[]>;
    public showQueue: boolean = false;

    constructor(private storeHome: Store<IHomeState>,
        private storeRouter: Store<IRouterState>,
        private queueService: QueueService) {}

    public startConnection() {
        // this.tokenSubscription$ = this.storeCredentials.select(getAuthToken).subscribe(data => {
        //   this.token = data;
        // });
        const token = localStorage.getItem('token');
        this.decodedToken = JwtHelper.decodeToken(token);

        const options: IHttpConnectionOptions = {
            accessTokenFactory: () => {
                return token;
            }
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(this.API_URL + '/home', options)
            .build();

        this.hubConnection
            .start()
            .then(() => {
                console.log('Connection Started In Home');
                this.checkRouterForQueueView();
            })
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public addSendUsersListener() {
        this.hubConnection.on('SendUsers', (users: IUser[]) => {
            this.storeHome.dispatch(new fromHomeActions.LoadUsersSuccess(Object.assign(users)));
            this.selectUsers();
            if (this.showQueue) {
                this.queueService.selectUsers();
            }
        });
    }

    private selectUsers() {
        this.users$ = this.storeHome.select(fromHomeSelector.getHomeUsers);
    }

    public checkRouterForQueueView() {
        this.routerSubscription = this.storeRouter.select(getRouterState).subscribe(data => {
            this.showQueue = data.state.url === '/home/queue';
            if (this.showQueue) {
                this.changeUserStatus('Queue');
            } else if (data.state.url === '/home') {
                this.changeUserStatus('Active');
            }
        });
    }

    public changeUserStatus(status: string) {
        const userId = this.decodedToken['id'];

        this.hubConnection.invoke('ChangeUserStatus', userId, status)
            .then((_) => console.log('Change User Successfully'))
            .catch(err => console.log('Error Change: ' + err));
    }

    public endConnection() {
        const userId = this.decodedToken['id'];
        this.storeHome.dispatch(new fromHomeActions.RemoveUser(userId));
        this.hubConnection.invoke<string>('DeleteUserFromCache', userId)
            .then((_) => console.log('Delete User From Redis'))
            .catch(err => console.log('Error Delete: ' + err));

        this.hubConnection
            .stop()
            .then(() => {
                console.log('Connection stopped');
                this.routerSubscription.unsubscribe();
            })
            .catch(err => console.log('Error while stopping connection: ' + err));
    }
}