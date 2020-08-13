import { Component, OnInit,Input,OnDestroy } from '@angular/core';
import{DataStorageService} from '../../../datastorage.service';
import{AuthService} from '../../../login/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import{Subscription} from 'rxjs';
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

  like(id,mail)
  {
    this.sub2=this.datastorage.likePost(id,mail,this.user.mail,1).subscribe(data=>{
       this.loading=true;
       this.datastorage.viewposts(this.mail,this.user.mail).
	  	subscribe(data=>{
	  		this.posts=data;
        this.loading=false;
	  	});
    });
  }

   unlike(id,mail)
  {
    this.sub3=this.datastorage.unlikePost(id,mail,this.user.mail,-1).subscribe(data=>{
      this.loading=true;
      this.datastorage.viewposts(this.mail,this.user.mail).
	  	subscribe(data=>{
	  		this.posts=data;
        this.loading=false;
	  	});
    });
  }

    share(post:any,mail:string,id:string)
    {
        this.sub4=this.datastorage.sharePost(post,mail,this.user.mail,id).subscribe(data=>{
        this.loading=true;
        this.sub5=this.datastorage.viewposts(this.mail,this.user.mail).
        subscribe(data=>{
          this.posts=data;
          this.loading=false;
        });
        this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });
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
      console.log("destroy");
    }
  }

  @Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>you shared a posts...</h4>'
})
export class SnackbarComponent {}


