
import{NgModule} from '@angular/core';
import{Routes,RouterModule} from '@angular/router';
import{LoginComponent} from './login/login.component';
import{HomeComponent} from './home/home.component';
import{AddfriendsComponent} from './addfriends/addfriends.component';
import{ProfileComponent} from './profile/profile.component';
// import{ChatComponent} from './chat/chat.component';
import{NotificationsComponent} from './notifications/notifications.component';
import{PagenotfoundComponent} from './pagenotfound/pagenotfound.component';

import {AuthGuard} from './auth.guard';

const appRoutes:Routes=[{path:'',redirectTo:'login',pathMatch:'full'},
						{path:'login',component:LoginComponent},
						{path:'home',component:HomeComponent,canActivate:[AuthGuard]},
						{path:'addFriends',component:AddfriendsComponent,canActivate:[AuthGuard]},
						{path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
						// {path:'chat',component:ChatComponent,canActivate:[AuthGuard]},
						{path:'notifications',component:NotificationsComponent,canActivate:[AuthGuard]},
						{path:'**',component:PagenotfoundComponent}
						]
							
						

@NgModule({

	imports :[RouterModule.forRoot(appRoutes)],
	exports:[RouterModule]
})
export class AppRoutingModule{}