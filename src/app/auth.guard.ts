import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import{AuthService} from './login/auth.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.isLogged.pipe(
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        } 
      }),tap(auth=>{
        if(!auth)
        {
          alert("Can't access the page before login!!!!");
          return this.router.navigate(['/']);
        }
      })
    
    );
  }
}
