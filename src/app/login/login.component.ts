import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators,NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';
// import {ChatService} from '../chat/messages/chat.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  reg:boolean=false;
  obj:any;
  error:string=null;
  loading:boolean;
  constructor(private fb: FormBuilder,private router:Router,private auth:AuthService,
    private _snackBar: MatSnackBar) {
  }

  private sub1:Subscription;
  private sub2:Subscription;
  private sub3:Subscription;
  private sub4:Subscription;
  private sub5:Subscription;
  async ngOnInit() {

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.firstFormGroup = this.fb.group({
      name: ['', Validators.required],
      mail: ['', Validators.email],
      gender: ['', Validators.required],
      dob: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      mobile: ['', Validators.required],
    });

     this.thirdFormGroup = this.fb.group({
      pwd: ['', Validators.required],
      cnf: ['', Validators.required]
    });

     this.sub5=this.auth.isLogged.subscribe(data=>{
      if(data)
      {
        console.log(data);      
        this.router.navigate(['/home']);
      }
      
    })

  }

  async onSubmit() {
    this.error=null;
    this.loading=true;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
  
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        this.sub3=this.auth.login(username,password).subscribe(data=>{
           this.error=null;
           this.sub4=this.auth.setUser().subscribe(data=>{
             // this.chat.newUser(username);
             this.loading=false;
             this.router.navigate(['/home']);
           });
           
         },err=>{
             this.loading=false;
             this.error=err;
         });
        // this.auth.login(username,password);
        // this.chat.newUser(username);
        // this.router.navigate(['/home']);
        // this.auth.setUser().subscribe();
      }
   
  }
 convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return ( [day,mnth,date.getFullYear()].join("-"));
}

  proceed()
  {
      this.error=null;
      this.firstFormGroup.value.dob=this.convert(this.firstFormGroup.value.dob)
      this.obj={...this.firstFormGroup.value,...this.secondFormGroup.value,
        pwd:this.thirdFormGroup.value.pwd,privacy:'Show to everyone',post_privacy:'Show to everyone'};
      this.reg=false;
      this.sub1= this.auth.signup(this.obj.mail,this.obj.pwd).subscribe(data=>{
         console.log(data);
         this.sub2=this.auth.insertUsers(this.obj).subscribe();
       },err=>{
             this.error=err;
         });
       this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });
  }

  cancel()
  {
    this.reg=!this.reg;
    this.ngOnInit();
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
  }

}

@Component({
  selector: 'snack-bar-component-example-snack',
  template: '<h4>Your account is created</h4>'
})
export class SnackbarComponent {}