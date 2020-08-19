import { Component,Inject, OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DataStorageService} from '../datastorage.service';
import {AuthService} from '../login/auth.service';
import {ChatService} from './messages/chat.service';
import {FormControl} from '@angular/forms';
import {Observable,Subscription} from 'rxjs';
import {map, startWith,tap} from 'rxjs/operators';
import {Notification} from '../shared/notification.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private datastorage:DataStorageService,private auth:AuthService,private chat:ChatService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private notify:Notification,private route:Router) {
    this.mobileQuery = media.matchMedia('(max-width:4000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener); }
  friends:any;
  friend:string;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;
  private sub6:Subscription;
  private sub7:Subscription;
  private sub8:Subscription;
  private sub9:Subscription;
  private sub10:Subscription;
  private sub11:Subscription;
  private sub12:Subscription;

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options:any=[];
  chatCount:number;
  msg:{mail:String};
  user:string;
  ngOnInit(): void {

    this.user=this.auth.getUser().name;
    this.notify.getPage.next(this.route.url);

  	this.sub1=this.datastorage.fetchFriends(this.auth.getUser().mail).
  		subscribe(data=>{
            this.options=data;
  		})

    this.sub2=this.datastorage.fetchChats(this.auth.getUser().mail).
      subscribe(data=>{
            this.friends=data;
      })

     this.sub3= this.chat.receiveMsg().subscribe(data=>{
          this.sub4=this.datastorage.fetchChats(this.auth.getUser().mail).
          subscribe(data=>{
                this.friends=data;
          })

      })

      this.sub5=this.chat.getChat.subscribe(data=>{
          this.sub6=this.datastorage.fetchChats(this.auth.getUser().mail).
          subscribe(data=>{
                this.friends=data;
          })
      })
        
    this.sub2=this.chat.getFriendList().subscribe(data=>{
        this.sub3=this.datastorage.fetchChats(this.auth.getUser().mail).
      subscribe(data=>{
      this.friends=data;
      })
    })

    this.sub7=this.chat.getDisconnected().subscribe(data=>{
        this.sub8=this.datastorage.fetchChats(this.auth.getUser().mail).
      subscribe(data=>{
      this.friends=data;
      })
    })

    setInterval(()=>{
        this.sub12=this.datastorage.countChat(this.auth.getUser().mail).subscribe(count=>{
              if(count.count>0)
              {
                this.chatCount=(count.count);  
              }
              else
                this.chatCount=null;
          })
    },1000)

        this.filteredOptions = this.myControl.valueChanges.pipe(
      
      map(value => this._filter(value)),tap(data=>{
        if(data&&data.length>0)
        {
          this.friend=data[0].friend;
        }
      })
    );
  } 

    private _filter(value: string) {
    const filterValue = value.toLowerCase();
    if(value.length>0)
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  openChat()
  {
    this.sub9=this.datastorage.viewFriend(this.auth.getUser().mail,this.friend).
      subscribe(data=>{
        this.chat.getFriends.next(data[0]);

      });   

      this.sub10=this.chat.getFriendList().subscribe(data=>{
        this.sub11=this.datastorage.viewFriend(this.auth.getUser().mail,this.friend).
      subscribe(data=>{
        this.chat.getFriends.next(data[0]);

      });   
    })
  }


  mobileQuery: MediaQueryList;
  changepwd:boolean=false;
  i:number=0;
  fillerNav=["View Profile","Edit Profile","change password","privacy","View your uploads"];
  private _mobileQueryListener: () => void;


  ngOnDestroy()
  {

    this.mobileQuery.removeListener(this._mobileQueryListener);
      if(this.sub1)
        this.sub1.unsubscribe();
      if(this.sub2)
        this.sub2.unsubscribe();
      if(this.sub3)
        this.sub3.unsubscribe();
      if(this.sub4)
        this.sub4.unsubscribe();
      if(this.sub5)
        this.sub5.unsubscribe();
      if(this.sub6)
        this.sub6.unsubscribe();
     if(this.sub7)
      this.sub7.unsubscribe();
     if(this.sub8)
      this.sub8.unsubscribe();
     if(this.sub9)
      this.sub9.unsubscribe();
     if(this.sub10)
      this.sub10.unsubscribe();
    if(this.sub11)
      this.sub11.unsubscribe();
    if(this.sub12)
      this.sub12.unsubscribe();
  }

 }