import { Component, OnInit,OnDestroy,ViewChild,ElementRef } from '@angular/core';
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
import { ObjectID } from 'bson';

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
 
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

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
        this.posts.unshift(data);
      });

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
  }
  scrollToTop()
  {
      try {
          this.myScrollContainer.nativeElement.scrollTop = 0;
      } catch(err) { }   


  }
  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent,{
      data: {mail:this.auth.getUser().mail},
    });
    this.scrollToTop();
  }

   like(id,mail,post:any)
  {
    this.sub3=this.datastorage.likePost(id,mail,this.auth.getUser().mail,1).subscribe(data=>{
       // this.fetchPosts();
       post.count++;
       post.like=1;
      //  this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
      //     this.notify.getNotifyCount.next(count.count++);  
      // })  
    });
  }

   unlike(id,mail,post:any)
  {
    this.sub4=this.datastorage.unlikePost(id,mail,this.auth.getUser().mail,-1).subscribe(data=>{
       // this.fetchPosts();
       post.count--;
       post.like=-1;
      //  this.datastorage.countNotify(this.auth.getUser().mail).subscribe(count=>{
      //     this.notify.getNotifyCount.next(count.count++);  
      // })  

    });
  }

  share(post:any,mail:string,id:string,name:string)
  {    
      const objId  = new ObjectID().toString();
      console.log(objId);
      this.sub5=this.datastorage.sharePost(post,mail,this.auth.getUser().mail,id,objId).subscribe(data=>{
        this.scrollToTop();
        this.posts.unshift(      
          {
            count: 0,
            image: this.auth.getUser().image,
            mail: this.auth.getUser().mail,
            name: "You",
            post: {caption:post.caption,desc:post.desc,img:post.img},
            post_date:this.formatDate(new Date().getTime()),
            post_time: this.formatTime(new Date().getTime()),
            privacy: this.auth.getUser().post_privacy,
            sharedFrom: mail,
            sharer: name,
            time: new Date().getTime(),
            type: post.type,
            _id:  objId
          }
        )

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

  formatDate(time) 
   {
                  
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let dateObj = new Date(time);
    let month = monthNames[dateObj.getMonth()];
    let day = String(dateObj.getDate()).padStart(2, '0');
    let year = dateObj.getFullYear();
    let output = day  + ' '+ month  + ' ' + year;
     return output;

  }

   formatTime(time) 
  {
      var date=new Date(time);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      var min = (minutes < 10 ? '0'+minutes : minutes);
      var strTime = hours + ':' + min + ' ' + ampm;
      
     return strTime;
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