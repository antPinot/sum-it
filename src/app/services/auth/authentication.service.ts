import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Credentials } from 'src/app/models/ICredentials';
import { IUserAvatar } from 'src/app/models/IUserAvatar';
import { UserInfo } from 'src/app/models/IUserInfo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginUrl : string = `${environment.restWebServiceUrl}session`

  private logoutUrl : string = `${environment.restWebServiceUrl}logout`

  private authCheckUrl : string = `${environment.restWebServiceUrl}session/validate`

  private getUserInfoUrl : string = `${environment.restWebServiceUrl}rest/user/info`

  private updateAvatarUrl : string = `${environment.restWebServiceUrl}rest/user/avatar`

  public userInfo$ = new BehaviorSubject<UserInfo>({});

  constructor(private http : HttpClient, private toastCtrl : ToastController) { }

  login(credentials: Credentials) {
    return this.http.post(this.loginUrl, credentials, {withCredentials:true})
  }

  logout(){
    return this.http.post(this.logoutUrl, {withCredentials:true}).pipe(
      tap(() => {
        this.userInfo$.next({})
      })
    )
  }

  checkAuthentication() : Observable<boolean> {
    return this.http.get<{ username: string }>(this.authCheckUrl, { withCredentials: true }).pipe(
      map(response => !!response.username),
      catchError(() => {
        this.toastCtrl.create({
          message: 'Veuillez vous connecter pour accéder à cette page',
          duration: 2000,
          position: 'bottom'
        }).then((toast) => toast.present());
        return of(false)
      })
    );
  }

  getUserInfo() : Observable<UserInfo>{
     return this.http.get(this.getUserInfoUrl).pipe(
      tap(response => this.userInfo$.next(response)))
  }

  updateAvatar(userAvatar: IUserAvatar) {
    return this.http.post(this.updateAvatarUrl, userAvatar);
  }

}
