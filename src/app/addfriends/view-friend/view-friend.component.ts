import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import {DataStorageService} from '../../datastorage.service';
import{AuthService} from '../../login/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import {Notification} from '../../shared/notification.service';
// import{ChatService} from '../../chat/messages/chat.service';
@Component({
  selector: 'app-view-friend',
  templateUrl: './view-friend.component.html',
  styleUrls: ['./view-friend.component.css']
})
export class ViewFriendComponent implements OnInit,OnDestroy {

  constructor(private datastorage:DataStorageService,private auth:AuthService,
    private _snackBar: MatSnackBar,private notify:Notification) { }
@Input()getfriend:any=[];
friend:any;
mail:string="";
private sub1:Subscription;
  ngOnInit(): void {
  	this.friend=this.getfriend[0];
  	this.mail=this.friend.mail;
  	console.log(this.mail);
    console.log(this.friend);

  }

  sendReq()
  {
  	this.sub1=this.datastorage.sendFriendRequests(this.auth.getUser().mail,this.mail).
    subscribe(data=>{
       this._snackBar.openFromComponent(SnackbarComponent1, {
              duration:2000,
            });
       this.friend.friendrequest="sent";
       // this.chat.sendFriendReq(this.mail);
    });
  }

  removeFriend()
  {

     this.sub1=this.datastorage.removeFriend(this.auth.getUser().mail,this.mail).
      subscribe(data=>{
       this._snackBar.openFromComponent(SnackbarComponent2, {
              duration:2000,
            });
       this.friend.friendrequest="";
    });   
  }

  cancelReq()
  {
    this.sub1=this.datastorage.delFriendRequests(this.auth.getUser().mail,this.mail).
      subscribe(data=>{
       this._snackBar.openFromComponent(SnackbarComponent2, {
              duration:2000,
            });
       this.friend.friendrequest="";
      });   
  }

  ngOnDestroy()
  {
    if(this.sub1)
    this.sub1.unsubscribe();
  }

}
@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Friend request send..</h4>'
})
export class SnackbarComponent1 {}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Friend removed ...</h4>'
})
export class SnackbarComponent2 {}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Friend request cancelled..</h4>'
})
export class SnackbarComponent3 {}