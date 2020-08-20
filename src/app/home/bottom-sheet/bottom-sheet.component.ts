import { Component, OnInit,Inject,OnDestroy } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA,MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import{DataStorageService} from '../../datastorage.service';
import{HomeService} from '../HomeService.service';
import {Subscription} from 'rxjs';
import {ChatService} from '../../chat/messages/chat.service';
import { ObjectID } from 'bson';
import {AuthService} from '../../login/auth.service';
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit,OnDestroy {

  constructor(private fb:FormBuilder,private datastorage:DataStorageService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,private _snackBar: MatSnackBar,
    private homeService:HomeService,private chat:ChatService,private auth:AuthService) { }

  image:any=null;
  form:FormGroup;
  type:string;
  post_data:any={};
  private sub1:Subscription;

  ngOnInit(): void {
      this.form = this.fb.group({
        caption: ["", Validators.required],
        desc: ["", Validators.required],
        type:['public',Validators.required]
      });
  }

  
  changeListener($event) : void {
  this.readThis($event.target);
  this._snackBar.openFromComponent(SnackbarComponent2, 
  {
      duration:2000,
    });
  }

readThis(inputValue: any): void {
  var file:File = inputValue.files[0];
  var myReader:FileReader = new FileReader();
  myReader.readAsDataURL(file);
  myReader.onloadend = (e) => {
  this.image = myReader.result;
  }

}

upload()
  { 

    if (this.form.valid)
    {
      var id=new ObjectID().toString();
      this.form.value.img=this.image;
      this.post_data=
        {
          count: 0,
          image: this.auth.getUser().image,
          mail: this.auth.getUser().mail,
          name: "You",
          post: {caption:this.form.value.caption,desc:this.form.value.desc,img:this.form.value.img},
          post_date:this.formatDate(new Date().getTime()),
          post_time: this.formatTime(new Date().getTime()),
          privacy: this.auth.getUser().post_privacy,
          time: new Date().getTime(),
          type: this.form.value.type,
          _id:  id
        }
             
       this.sub1=this.datastorage.createPost(id,this.data,this.form.value).
         subscribe(data=>{
             this._bottomSheetRef.dismiss();
              event.preventDefault();
            this.homeService.updateHomePage.next(this.post_data);
             this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });

         });
      
    }  
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
      console.log("destroy")
    }
}


@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>post uploaded...</h4>'
})
export class SnackbarComponent {}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>image added</h4>'
})
export class SnackbarComponent2 {}