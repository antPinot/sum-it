import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Credentials } from 'src/app/models/ICredentials';
import { UserInfo } from 'src/app/models/IUserInfo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginUrl : string = `${environment.restWebServiceUrl}session`

  private authCheckUrl : string = `${environment.restWebServiceUrl}session/validate`

  private userInfo = new BehaviorSubject<UserInfo>({});

  constructor(private http : HttpClient) { }

  login(credentials: Credentials) {
    return this.http.post(this.loginUrl, credentials, {withCredentials:true})
  }

  checkAuthentication() : Observable<boolean> {
    return this.http.get<{ username: string }>(this.authCheckUrl, { withCredentials: true }).pipe(
      map(response => !!response.username),
      catchError(() =>of(false)))
  }

}
