
import{NgModule} from '@angular/core';
import{Routes,RouterModule} from '@angular/router';
import{LoginComponent} from './login/login.component';
import{HomeComponent} from './home/home.component';
import{AddfriendsComponent} from './addfriends/addfriends.component';
import{ProfileComponent} from './profile/profile.component';
import{ChatComponent} from './chat/chat.component';
import{NotificationsComponent} from './notifications/notifications.component';
const appRoutes:Routes=[{path:'',redirectTo:'login',pathMatch:'full'},
						{path:'login',component:LoginComponent},
						{path:'home',component:HomeComponent},
						{path:'addFriends',component:AddfriendsComponent},
						{path:'profile',component:ProfileComponent},
						{path:'chat',component:ChatComponent},
						{path:'notifications',component:NotificationsComponent},
						]
							
						

@NgModule({

	imports :[RouterModule.forRoot(appRoutes)],
	exports:[RouterModule]
})
export class AppRoutingModule{}