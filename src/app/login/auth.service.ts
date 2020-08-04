import{Injectable}from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject,BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService
{

  constructor(private http: HttpClient, private router: Router) {}

  isLogged=new BehaviorSubject<any>(null);
  changepwd=new Subject<void>();
  credentials:{mail:string,pwd:string};
  userResponse:any;
  private user:any;
  signup(email: string, password: string) 
	  {
		return this.http
		  	.post<any>(
		    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAocnadGxPpOGmXzzvAhtmzEB3O2pwkUi8',
		    {
		      email: email,
		      password: password,
		      returnSecureToken: true
		    }
		  ).pipe(
    		catchError(this.handleError)
    		);
		 
		}

		
  login(email: string, password: string) 
	  {
	  	this.credentials={mail:email,pwd:password};
		return this.http
		  	.post<any>(
		    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAocnadGxPpOGmXzzvAhtmzEB3O2pwkUi8',

		    {
		      email: email,
		      password: password,
		      returnSecureToken: true
		    }
		  ).pipe(
    		catchError(this.handleError),
    		tap(data=>{
    			// localStorage.setItem('user',JSON.stringify(data));
    			this.userResponse=data;
    		})
		);
		 
		}

	changePwd(pwd)
	{
		return this.http
		  	.post<any>(
		    'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAocnadGxPpOGmXzzvAhtmzEB3O2pwkUi8',

		    {
		     	idToken:this.userResponse.idToken,
		     	password:pwd,
		     	returnSecureToken:true 
		    }
		  ).pipe(
    		catchError(this.handleError),
    		tap(data=>{
    			console.log(data);
    		})
		);
	}

	insertUsers(user:any)
	{
		return this.http
		  	.post<any>(
		    '/insertUser',
		    {
		      user:user
		    }
		  )
	}

	updatePwd(pwd:any)
	{
		return this.http
		  	.post<any>(
		    '/updatePwd',
		    {	
		    	mail:this.credentials.mail,
		      	pwd:pwd
		    }
		  )
	}

	setUser()
	{
		return this.http
		  	.post<any>(
		    '/getUser',
		    {
		      credentials:this.credentials
		    }
		  ).pipe(tap(data=>
		  	{this.user=data;
		  		console.log(this.user);
		  		localStorage.setItem('user',JSON.stringify(data));
    			this.isLogged.next(this.user);
		  	}));
	}

	getUser()
	{
		return this.user;
	}

	private handleError(errorRes: HttpErrorResponse)
	 {
	 	console.log(errorRes);
		let errorMessage = 'An unknown error occurred!';
		if (!errorRes.error || !errorRes.error.error) {
		  return throwError(errorMessage);
		}
		switch (errorRes.error.error.message) {
		  case 'EMAIL_EXISTS':
		    errorMessage = 'This email exists already';
		    break;
		  case 'EMAIL_NOT_FOUND':
		    errorMessage = 'This email does not exist.';
		    break;
		  case 'INVALID_PASSWORD':
		    errorMessage = 'This password is not correct.';
		    break;
		}
		return throwError(errorMessage);
	}

	autoLogin()
	{
		this.user=JSON.parse(localStorage.getItem('user'));
		this.isLogged.next(this.user);

	}
}