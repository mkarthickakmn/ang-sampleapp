import { Component, OnInit ,OnDestroy} from '@angular/core';
import{DataStorageService} from '../../datastorage.service';
import{AuthService} from '../../login/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit,OnDestroy {

  constructor(private _snackBar: MatSnackBar,private datastorage:DataStorageService,private auth:AuthService) { }
  panelOpenState1:boolean=false;
  panelOpenState2:boolean=false;
  prof_privacy:string;
  post_privacy:string;
  privacy=["Show to Friends only","Show to everyone","Hide from everyone"];
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  ngOnInit(): void {
  	this.sub1=this.datastorage.getProfilePrivacy(this.auth.getUser().mail).
  		subscribe(data=>{
  			console.log(data)
  			if(data.privacy)
  				this.prof_privacy=data.privacy;
  			else
  				this.prof_privacy="Show to everyone";
  		});

	this.sub2=this.datastorage.getPostPrivacy(this.auth.getUser().mail).
		subscribe(data=>{
			console.log(data)
			if(data.privacy)
				this.post_privacy=data.privacy;
			else
				this.post_privacy="Show to everyone";
		});
  }

  hideProfile(prof_privacy:string)
  {
  	this.sub3=this.datastorage.setProfilePrivacy(this.auth.getUser().mail,prof_privacy).
  		subscribe(data=>{
  			 this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });
  		});
  }

hidePosts(post_privacy:string)
  {
  	this.sub4=this.datastorage.setPostPrivacy(this.auth.getUser().mail,post_privacy).
  		subscribe(data=>{
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
  }


}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Your privacy is maintained...</h4>'
})
export class SnackbarComponent {}