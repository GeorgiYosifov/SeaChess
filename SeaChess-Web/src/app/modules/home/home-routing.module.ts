import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { QueueComponent } from './components/queue/queue.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent, 
        children: [
            { path: 'queue', component: QueueComponent },
        ],
        canActivate: [AuthGuard] 
    },
    //{ path: 'queue', component: QueueComponent, canActivate: [AuthGuard] }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }