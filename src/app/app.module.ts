import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { AppComponent } from './app.component';
import { MaterialModule } from "./material-ui.module";
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import{HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import{AppRoutingModule} from './app-routing.module';
import { ViewProfileComponent } from './profile/view-profile/view-profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ChangePwdComponent } from './profile/change-pwd/change-pwd.component';
import { BottomSheetComponent } from './home/bottom-sheet/bottom-sheet.component';
import { AddfriendsComponent } from './addfriends/addfriends.component';
import { ViewFriendComponent } from './addfriends/view-friend/view-friend.component';
import { FetchpostsComponent } from './addfriends/view-friend/fetchposts/fetchposts.component';
import { PrivacyComponent } from './profile/privacy/privacy.component';
import { AutofocusDirective } from './shared/autofocus.directive';
import { UploadsComponent } from './profile/uploads/uploads.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    ViewProfileComponent,
    EditProfileComponent,
    ChangePwdComponent,
    BottomSheetComponent,
    AddfriendsComponent,
    ViewFriendComponent,
    FetchpostsComponent,
    PrivacyComponent,
    AutofocusDirective,
    NotificationsComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  entryComponents: [
    HomeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
