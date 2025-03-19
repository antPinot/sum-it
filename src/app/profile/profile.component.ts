import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { UserInfo } from '../models/IUserInfo';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {

  constructor(private authService : AuthenticationService, private router:Router) { }

  protected userInfo$ : Observable<UserInfo | null> = this.authService.userInfo$;

  ngOnInit() {
    this.authService.getUserInfo().subscribe();
  }

  logout(){
    this.authService.logout().subscribe(
      () => this.router.navigateByUrl('home')
    )
  }

}
