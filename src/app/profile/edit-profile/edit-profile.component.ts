import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from '../../login/auth.service';
import{DataStorageService} from '../../datastorage.service';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit,OnDestroy{

  constructor(private auth:AuthService,private datastorage:DataStorageService,private fb:FormBuilder,
    private _snackBar: MatSnackBar) { }
  user:any;
   image:any='';
  editform:FormGroup;
  private sub1:Subscription;
  private sub2:Subscription;
  ngOnInit(): void {
    
      this.user=this.auth.getUser();
      this.image=this.user.image;
      this.image=this.user.image;
      this.editform = this.fb.group({
        name: [this.user.name, Validators.required],
        gender: [this.user.gender, Validators.required],
        dob: [this.user.dob, Validators.required],
        street: [this.user.street, Validators.required],
        city: [this.user.city, Validators.required],
        state: [this.user.state, Validators.required],
        mobile: [this.user.mobile, Validators.required]
      });
  	   
  }

  
  changeListener($event) : void {
  this.readThis($event.target);
}

readThis(inputValue: any): void {
  var file:File = inputValue.files[0];
  var myReader:FileReader = new FileReader();
  myReader.readAsDataURL(file);
  myReader.onloadend = (e) => {
  this.image = myReader.result;
  }

}

update()
{	 
	let obj={...this.editform.value,image:this.image};
	this.sub1=this.datastorage.updateProfile(obj,this.user.mail).
	subscribe(data=>{
		    this.sub2=this.auth.setUser().subscribe(data=>this.user=data);
         this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });
	});
}

remove()
{
  console.log('removed');
  this.image='';
  
}

  ngOnDestroy()
  {
      if(this.sub1)
        this.sub1.unsubscribe();
      if(this.sub2)
        this.sub2.unsubscribe();
  }

}


@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4 class="mat-simple-snackbar-action">profile updated...</h4>'
})
export class SnackbarComponent {}
