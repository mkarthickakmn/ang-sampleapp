import { Component,Inject, OnInit,ChangeDetectorRef,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import{AuthService} from '../login/auth.service';
export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements  OnDestroy,OnInit{

  mobileQuery: MediaQueryList;
  changepwd:boolean=false;
  i:number=0;
  fillerNav=["View Profile","Edit Profile","change password","privacy","View your uploads"];
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public dialog: MatDialog,private auth:AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 4000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  animal: string;
  name: string="kk";
  tab(i:number)
  {
    if(i!=2)
      this.i=i;
    if(i==2)
    {
        this.openDialog();
    }
  }

  ngOnInit(): void {
    this.auth.changepwd.subscribe(data=>{this.changepwd=true,this.i=2});
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

   openDialog(): void {
    const dialogRef = this.dialog.open(Dialogbox, {
      width: '250px',
      data: {name: this.auth.getUser().name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialogbox.html',
})
export class Dialogbox {

  constructor(
    public dialogRef: MatDialogRef<Dialogbox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private auth:AuthService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  reqChangePwd()
  {
     this.dialogRef.close();
     this.auth.changepwd.next();     
  }

}