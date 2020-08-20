import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import{DataStorageService} from '../../../datastorage.service';
import{AuthService} from '../../../login/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import{Subscription} from 'rxjs';
import { ObjectID } from 'bson';
@Component({
  selector: 'app-fetchposts',
  templateUrl: './fetchposts.component.html',
  styleUrls: ['./fetchposts.component.css']
})
export class FetchpostsComponent implements OnInit,OnDestroy {

  constructor(private datastorage:DataStorageService,private auth:AuthService,private _snackBar: MatSnackBar) { }
  @Input() mail:string;
  posts:any;
  user:any;
  noPosts:string="";
  loading:boolean;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;
    ngOnInit(): void {
    this.loading=true;
    this.user=this.auth.getUser();
  	this.sub1=this.datastorage.viewposts(this.mail,this.user.mail).
  	subscribe(data=>{
      this.loading=false;
      if(data.length>0)
  		  this.posts=data;
      else if(data.length==0)
      {
        this.noPosts="No posts availabe..."
      }
      else if(data.privacy)
      {
        this.noPosts="This account is private.."
      }
  	});
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
      // this.fetchPosts();  
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
      console.log("destroy");
    }
  }

  @Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>you shared a posts...</h4>'
})
export class SnackbarComponent {}


