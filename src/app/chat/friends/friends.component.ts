import { Component, OnInit,Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import {ChatService} from '../messages/chat.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit,OnDestroy {

  constructor(private chat:ChatService) { }
  @Input() friends:any;
  id:number;
  mail:any;  
  private sub1:Subscription;
  private sub2:Subscription;
  ngOnInit(): void {
      console.log("hi")
      this.sub1=this.chat.getChat.subscribe((data:any)=>{
       this.mail=data;
       this.id=null;
    })
      this.sub2=this.chat.getFriends.subscribe((data:any)=>{
        this.mail=data.mail;
        this.id=null;
      })   
  }
  getMsg(friend:any,id:number)
  {
      this.chat.getFriends.next(friend);
      this.id=id;
  }

  styleObject(friend:any)
  {
    if(friend._id==this.id||this.mail==friend.mail)
    {
        friend.count=0;
        return {backgroundColor: "cadetblue",color: "white"};
    }
  }

  ngOnDestroy()
  {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

}
