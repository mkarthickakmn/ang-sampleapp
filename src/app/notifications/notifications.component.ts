import { Component,Inject, OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DataStorageService} from '../datastorage.service';
import {AuthService} from '../login/auth.service';
import {Notification}from '../shared/notification.service';
export interface DialogData {
  caption:string,
  desc:string,
  img: string,
  name:string,
  image:string,

}
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit,OnDestroy {

  constructor(private datastorage:DataStorageService,private auth:AuthService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog,private notify:Notification) { }

 notifications:any=[];
  ngOnInit(): void {
  	this.datastorage.getNotifications(this.auth.getUser().mail).subscribe(data=>{
  		console.log(data);
  		this.notifications=data;
  	})
  }

   getNotification(id:string): void {
   	this.datastorage.getPost(id,this.auth.getUser().mail).subscribe(data=>{
   		console.log(data);
   		  const dialogRef = this.dialog.open(Dialogbox, {
      width: '500px',
      data: {...data.post,name:data.name,image:data.image,type:data.type}
    });
   		     dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
   	}); 
  }

  ngOnDestroy()
  {
  	this.notify.getNotifyCount.next(null);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'postdialog.component.html',
styleUrls: ['./notifications.component.css']

})

export class Dialogbox {

  constructor(
    public dialogRef: MatDialogRef<Dialogbox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private auth:AuthService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


}