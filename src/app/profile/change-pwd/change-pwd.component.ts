import { Component, OnInit ,OnDestroy} from '@angular/core';
import{AuthService} from '../../login/auth.service';
import{FormGroup,Validators,FormControl} from '@angular/forms';
import{Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent implements OnInit,OnDestroy {

  constructor(private auth:AuthService,private route:Router,private _snackBar: MatSnackBar) { }
  form:FormGroup;
  private sub1:Subscription;
  private sub2:Subscription;

  ngOnInit(): void {
  	this.form=new FormGroup({
  		old:new FormControl('',Validators.required),
  		new:new FormControl('',Validators.required),
  		cnf:new FormControl('',Validators.required),
  	});
  }

  submit()
  {
      let user=this.auth.getUser();
      if(user.pwd==this.form.value.old)
      {
        this.sub1=this.auth.changePwd(this.form.value.new).
        subscribe(data=>{
          this.sub2=this.auth.updatePwd(this.form.value.new).
          subscribe(data=>{
            console.log('password updated');
            this._snackBar.openFromComponent(SnackbarComponent, {
              duration:2000,
            });
            localStorage.clear();
            this.auth.isLogged.next(null);
            this.route.navigate(['/login']);
          });
        });
      }
      else
      {
          alert('password incorrect');
      }
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
  template: '<h4>Your password is changed</h4>'
})
export class SnackbarComponent {}
