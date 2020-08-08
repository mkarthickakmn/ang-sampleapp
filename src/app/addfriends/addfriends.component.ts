import {Component, OnInit,EventEmitter,Output,OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable,Subscription} from 'rxjs';
import {map, startWith,tap} from 'rxjs/operators';
import {DataStorageService} from '../datastorage.service';
import{AuthService} from '../login/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import{Notification} from '../shared/notification.service';
import{Router} from '@angular/router';
@Component({
  selector: 'app-addfriends',
  templateUrl: './addfriends.component.html',
  styleUrls: ['./addfriends.component.css'],
})
export class AddfriendsComponent implements OnInit {

  constructor(private datastorage:DataStorageService,private auth:AuthService,
    private _snackBar: MatSnackBar,private notify:Notification,private route:Router) { }
  
  viewfriendDetails:any=[];
  panelOpenState = false;
  panelOpenState1 = false;
  myControl = new FormControl();
  options:any[]=[];
  friend:string;
  request:any="";
  getfriend:any=[];
  filteredOptions: Observable<string[]>;
  list:any=[];
  req:string="";
  search:boolean=true;
  count:number;
  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;
  private sub6:Subscription;
  private sub7:Subscription;
  private sub8:Subscription;
  private sub9:Subscription;
  private sub10:Subscription;
  private sub11:Subscription;
  private sub12:Subscription;

   ngOnInit() {
   
    this.sub1=this.datastorage.fetchFriendRequests(this.auth.getUser().mail).
    subscribe(data=>{
  
        this.request=data;
        this.req=data;       
    });

    this.sub11=this.datastorage.fetchFriendCount(this.auth.getUser().mail).
    subscribe(data=>{
  
        this.count=data.count;
    });  

    this.sub2=this.datastorage.getFriends(this.auth.getUser().mail).subscribe(data=>{
      console.log(data);
      this.options=data;
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      
      map(value => this._filter(value)),tap(data=>{
        if(data&&data.length>0&&this.myControl.value==data[0].name)
        {
          this.friend=data[0].mail;
          this.search=false;
        }
        else
          this.search=true;
      })
    );
    this.notify.getPage.next(this.route.url);
  }

  viewList()
  {
     if(this.panelOpenState)
      {
          this.sub3=this.datastorage.fetchFriends(this.auth.getUser().mail).subscribe(data=>{
              this.list=data;
              this.count=this.list.length;
      });
    }
  }

  openFriends()
  {
    console.log(this.myControl.value);
    this.getfriend="";
    this.sub4=this.datastorage.viewFriend(this.auth.getUser().mail,this.friend).
      subscribe(data=>{
        console.log(data);
        this.getfriend=data;
        this.request="";
      });
    
  }

  openFriendProfile(friend:string)
  {
    if(this.panelOpenState1)
    {
      this.viewfriendDetails="";
      console.log(friend);
      this.sub5=this.datastorage.viewFriend(this.auth.getUser().mail,friend).
        subscribe(data=>{
          this.viewfriendDetails=data;
        });
    }
    
  }
  back()
  {
    this.getfriend="";
    this.request=this.req;
  }

  accept(from:string,to:string,id:string)
  {
      this.sub6=this.datastorage.acceptFriendRequests(from,to,id).subscribe(data=>{
         this._snackBar.openFromComponent(SnackbarComponent1, {
              duration:2000,
            });
       this.sub7=this.datastorage.fetchFriendRequests(this.auth.getUser().mail).
        subscribe(data=>{

            this.request=data;
          
        });
         this.sub12=this.datastorage.fetchFriendCount(this.auth.getUser().mail).
        subscribe(data=>{
      
            this.count=data.count;
        });  

        this.datastorage.countFriendRequests(this.auth.getUser().mail).subscribe(count=>{
            this.notify.getFriendCount.next(count.count);  
        })
      });
  }

  del(from:string,to:string)
  {
      this.sub8=this.datastorage.delFriendRequests(from,to).subscribe(data=>{
        this._snackBar.openFromComponent(SnackbarComponent2, {
              duration:2000,
            });
       this.sub9= this.datastorage.fetchFriendRequests(this.auth.getUser().mail).
          subscribe(data=>{
   
              this.request=data;            
          });
          this.datastorage.countFriendRequests(this.auth.getUser().mail).subscribe(count=>{
            this.notify.getFriendCount.next(count.count);  
        })
      });
  }


  removeFriend(mail:string)
  {

     this.sub10=this.datastorage.removeFriend(this.auth.getUser().mail,mail).
      subscribe(data=>{
       this._snackBar.openFromComponent(SnackbarComponent3, {
              duration:2000,
            });
       this.viewList();
    });   
  }

 
  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    if(value.length>0)
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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
  if(this.sub6)
    this.sub6.unsubscribe();
  if(this.sub7)
    this.sub7.unsubscribe();
  if(this.sub8)
    this.sub8.unsubscribe();
  if(this.sub9)
    this.sub9.unsubscribe();
  if(this.sub10)
    this.sub10.unsubscribe();
  if(this.sub11)
    this.sub11.unsubscribe();
  if(this.sub12)
    this.sub12.unsubscribe();
      console.log("destroy");
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Friend request accepted...</h4>'
})
export class SnackbarComponent1 {}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Friends request deleted...</h4>'
})
export class SnackbarComponent2 {}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Your Friend is deleted...</h4>'
})
export class SnackbarComponent3 {}