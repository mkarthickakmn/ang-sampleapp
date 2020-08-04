import { Component,OnInit,Input,OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
// import {ChatService} from '../chat/messages/chat.service';
import{AuthService} from '../login/auth.service';
import {Subscription} from 'rxjs';
import {Notification} from '../shared/notification.service';
import{DataStorageService} from '../datastorage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{

  @Input() isLogin:boolean;
  user:any;
  chatCount:number;
  requestCount:number;
  notifyCount:number;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;

  constructor(private auth:AuthService,private route:Router,
  private notify:Notification,private datastorage:DataStorageService){}
  
  ngOnInit()
  {
    this.sub1=this.auth.isLogged.subscribe(data=>{
      if(data)
      {
        console.log(data);
        this.user=data.name;
      }
      
    })

    this.sub2=this.notify.getChatCount.subscribe((count)=>{
       if(count)
            this.chatCount=count;
        else
            this.chatCount=null;          
    })

    this.sub3=this.notify.getFriendCount.subscribe((count)=>{
       if(count)
            this.requestCount=count;
        else
            this.requestCount=null;          
    })

     this.sub4=this.notify.getNotifyCount.subscribe((count)=>{
     if(count)
          this.notifyCount=count;
      else
          this.notifyCount=null;          
    })

  }

  logout()
  {
    this.auth.isLogged.next(null);
    // this.chat.disconnected(this.auth.getUser().mail);
    console.log('logout')
    this.route.navigate(['/login']);
    localStorage.clear();
  }
  
  ngOnDestroy()
  {
    if(this.sub1)
      this.sub1.unsubscribe();
    if(this.sub2)
      this.sub2.unsubscribe();
    if(this.sub3)
      this.sub3.unsubscribe();
    if(this.sub4)
      this.sub4.unsubscribe();
    console.log("destroy")
  }

}
