import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService : AuthenticationService, private router : Router){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.checkAuthentication().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated){
          this.router.navigate(['/auth/login'])
        }
      })
    );
  }
}

/**@toimplement */
// const canActivateAuth: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot)
//   : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
//   return
// }