import { Component,OnInit,OnDestroy } from '@angular/core';
import{AuthService} from './login/auth.service';
// import{ChatService} from './chat/messages/chat.service';
import {Subscription} from 'rxjs';
import{Notification} from './shared/notification.service';
import {DataStorageService} from './datastorage.service';
import{Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{

constructor(private auth:AuthService,
  private notify:Notification,private datastorage:DataStorageService,private route:Router){}
  title = 'Chatterbox';
  isLogin:boolean=false;
  path:string;
  private sub:Subscription;
  ngOnInit():void
  {
  //   this.chat.receiveMsg().subscribe(data=>{
  //    if(this.route.url!='/chat')
  //       this.datastorage.countChat(this.auth.getUser().mail).subscribe(count=>{
  //             this.notify.getChatCount.next(count.count);  
  //         })
  //   })

  setInterval(()=>{
       if(this.route.url!='/addFriends')   
         this.datastorage.countFriendRequests(this.auth.getUser().mail).subscribe(count=>{
          this.notify.getFriendCount.next(count.count);  
      })

       if(this.route.url!='/notifications')   
         this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
          this.notify.getNotifyCount.next(count.count);  
      }) 
  },1000)

  //   this.chat.getFriendReq().subscribe(data=>{
  //     if(this.route.url!='/addFriends')   
  //        this.datastorage.countFriendRequests(this.auth.getUser().mail).subscribe(count=>{
  //         this.notify.getFriendCount.next(count.count);  
  //     })
  //   })

  //   this.chat.getLikePosts().subscribe(data=>{
  //    if(this.route.url!='/notifications')   
  //        this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
  //         this.notify.getNotifyCount.next(count.count);  
  //     })  
  // })

    this.sub=this.auth.isLogged.subscribe(data=>{
        if(data)
          this.isLogin=true;
        else
          this.isLogin=false;
  	});

    this.auth.autoLogin();
  		
  }

  ngOnDestroy()
  {
    this.sub.unsubscribe();
    console.log("destroy")
  }
}
