import { Component, OnInit,OnDestroy } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {DataStorageService} from '../../datastorage.service';
import{AuthService} from '../../login/auth.service';
import{HomeService} from '../../home/HomeService.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
import{Notification} from '../../shared/notification.service';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {

  constructor(private _bottomSheet: MatBottomSheet,private datastorage:DataStorageService,
    private auth:AuthService,private homeService:HomeService,private _snackBar: MatSnackBar,
    private notify:Notification) {}
   image:any='';
  uploadpost:FormGroup;
  user:any=null;
  posts:any;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;

  ngOnInit(): void {
    this.user=this.auth.getUser();
     

    if(this.user)
    {
      this.fetchPosts();
      
    }
    this.sub2=this.homeService.updateHomePage.
      subscribe(data=>{
        this.fetchPosts();
      });
  }

  like(id,mail)
  {
    this.sub3=this.datastorage.likePost(id,mail,this.auth.getUser().mail,1).subscribe(data=>{
       this.fetchPosts();
    });
  }

   unlike(id,mail)
  {
    this.sub4=this.datastorage.unlikePost(id,mail,this.auth.getUser().mail,-1).subscribe(data=>{
       this.fetchPosts();
    });
  }

  del(id)
  {
  	this.sub5=this.datastorage.delPost(id).subscribe(data=>{
	 	
       this.fetchPosts();
        this._snackBar.openFromComponent(SnackbarComponent1, {
	      duration:2000,
	    });
    });
  }

  fetchPosts()
  {
  	this.sub1=this.datastorage.selfPosts(this.user.mail).
        subscribe(data=>{
           this.posts=data;
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
  template: '<h4>Your post is deleted...</h4>'
})
export class SnackbarComponent1 {}