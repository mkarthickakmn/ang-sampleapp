import { Component, OnInit,OnDestroy } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import{BottomSheetComponent} from './bottom-sheet/bottom-sheet.component';
import {DataStorageService} from '../datastorage.service';
import{AuthService} from '../login/auth.service';
import{HomeService} from './HomeService.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import{Notification} from '../shared/notification.service';
import {Router} from '@angular/router';

// import{ChatService} from '../chat/messages/chat.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  constructor(private _bottomSheet: MatBottomSheet,private datastorage:DataStorageService,
    private auth:AuthService,private homeService:HomeService,private _snackBar: MatSnackBar,
    private notify:Notification,private route:Router) {}
   image:any='';
  uploadpost:FormGroup;
  user:any=null;
  posts:any;
  loading:boolean;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;

  ngOnInit(): void {
    this.loading=true;
    this.user=this.auth.getUser();
    this.notify.getPage.next(this.route.url)
     this.datastorage.countChat(this.user.mail).subscribe(count=>{
          this.notify.getChatCount.next(count.count);  
      })
    
    this.datastorage.countFriendRequests(this.user.mail).subscribe(count=>{
          this.notify.getFriendCount.next(count.count);  
      })

    if(this.user)
    {
      this.fetchPosts();
      
    }
    this.sub2=this.homeService.updateHomePage.
      subscribe(data=>{
        this.fetchPosts();
      });

      this.datastorage.countChat("test2@gmail.com").subscribe();
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent,{
      data: {mail:this.auth.getUser().mail},
    });
  }

  like(id,mail)
  {
    this.sub3=this.datastorage.likePost(id,mail,this.auth.getUser().mail,1).subscribe(data=>{
       this.fetchPosts();
       // this.chat.likePost(mail);
       this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
          this.notify.getNotifyCount.next(count.count++);  
      })  
    });
  }

   unlike(id,mail)
  {
    this.sub4=this.datastorage.unlikePost(id,mail,this.auth.getUser().mail,-1).subscribe(data=>{
       this.fetchPosts();
       // this.chat.likePost(mail);
       this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
          this.notify.getNotifyCount.next(count.count++);  
      })  

    });
  }

  share(post:any,mail:string,id:string)
  {
      this.sub5=this.datastorage.sharePost(post,mail,this.auth.getUser().mail,id).subscribe(data=>{
      this.fetchPosts();
      this._snackBar.openFromComponent(SnackbarComponent, {
            duration:2000,
          });
    });
  }


  fetchPosts()
  {
    this.sub1=this.datastorage.fetchPosts(this.user.mail).
        subscribe(data=>{
          this.posts=data;
          this.loading=false;
          console.log(data);
        });
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
      if(this.sub5)
        this.sub5.unsubscribe();
      console.log("destroy")
    }

}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>You shared a post...</h4>'
})
export class SnackbarComponent {}