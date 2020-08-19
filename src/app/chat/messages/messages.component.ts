import { Component, OnInit,Input,Output,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import{AuthService} from '../../login/auth.service';
import{DataStorageService} from '../../datastorage.service';
import{ChatService} from './chat.service';
import {Subscription} from 'rxjs';
import{Notification} from '../../shared/notification.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private auth:AuthService,private datastorage:DataStorageService,
    private chat:ChatService,private notify:Notification) { }
  mail:string="";
  messages:any=[];
  message:string="";
  friend:any;
  info:string="Select a friend to display chat messages";
  users_info:any={}
  user:any;
  count:number=0;
  down:boolean=false;
  up:boolean=false;
  scroll:boolean=false;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  ngOnInit(): void {

    this.notify.getChatCount.next(null);
  	this.user=this.auth.getUser();
    // this.sub1=this.chat.getFriendList().subscribe(data=>{
    // });
    this.sub2=this.chat.getFriends.subscribe(data=>{
      this.friend=data;
      this.messages=[]
      if(this.friend.mail)
        this.sub3=this.chat.getMessages({from:this.friend.mail,to:this.user.mail}).subscribe(data=>{
        // this.sub3=this.chat.getMessages({from:this.friend.friend,to:this.user.mail}).subscribe(data=>{
        this.messages=[];
        this.messages.push(...data);
        this.down=true;
        this.up=false;

      });

  })
	
    this.sub4=this.chat.receiveMsg().subscribe(data=>{
         console.log(data)
         if((this.friend&&(this.friend.mail==data.from)))
         {
             this.messages.push(data);
             this.scroll=false;
             this.datastorage.fetchChats(this.auth.getUser().mail).
              subscribe(friends=>{
                 this.chat.updateMsg(data).subscribe();
            })              
           
         }

    })

  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }
      if(this.myScrollContainer.nativeElement.scrollTop)
        this.scroll=true;  
            
  }

  ngAfterViewChecked() {     
       if(!this.scroll)
          {
            this.scrollToBottom();   
          }
        else
          console.log("scroll");      
    } 

   sendMessage()
  {
    //friend.friend
     if(this.message.length>0)
      {
        if(this.friend.mail)
            {
                this.chat.sendMessage({from:this.user.mail,to:this.friend.mail,message:this.message,date:this.getdays,time:this.formatAMPM()});
                this.chat.getChat.next(this.friend.mail);
            }
            else
            {
              if(this.friend.p1==this.user.mail)
                this.chat.sendMessage({from:this.user.mail,to:this.friend.p2,message:this.message,date:this.getdays,time:this.formatAMPM()});
              else
                this.chat.sendMessage({from:this.user.mail,to:this.friend.p1,message:this.message,date:this.getdays,time:this.formatAMPM()});
      
            }
            this.messages.push({from:this.user.mail,to:this.friend.mail,message:this.message,date:this.getdays,time:this.formatAMPM()});
            this.message="";
             this.scroll=false;
      }
    

  }

        formatAMPM()
         {
          var date=new Date();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          if(minutes<10)
            var strTime = hours + ':' + '0'+minutes + ' ' + ampm;
          else
            var strTime = hours + ':' + minutes + ' ' + ampm;
          return strTime;
         
        }      

        getdays()
        {
           const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            let dateObj = new Date();
            let month = monthNames[dateObj.getMonth()];
            let day = String(dateObj.getDate()).padStart(2, '0');
            let year = dateObj.getFullYear();
            let output = day  + ' '+ month  + ' ' + year;
            return output;
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
       this.datastorage.countChat(this.auth.getUser().mail).subscribe(count=>{
            this.notify.getChatCount.next(count.count);  
        })
    
      console.log("destroy")
    }
}
