import { Component, OnInit,Inject,OnDestroy } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA,MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import{DataStorageService} from '../../datastorage.service';
import{HomeService} from '../HomeService.service';
import {Subscription} from 'rxjs';
import {ChatService} from '../../chat/messages/chat.service';
@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit,OnDestroy {

  constructor(private fb:FormBuilder,private datastorage:DataStorageService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,private _snackBar: MatSnackBar,
    private homeService:HomeService,private chat:ChatService) { }

  image:any=null;
  form:FormGroup;
  type:string;
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
    
      this.form.value.img=this.image;
       this.sub1=this.datastorage.createPost(this.data,this.form.value).
         subscribe(data=>{
             this._bottomSheetRef.dismiss();
              event.preventDefault();
              this.chat.setNotification("user@gmail.com");
             this.homeService.updateHomePage.next();
            
             this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });

         });
      
    }  
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