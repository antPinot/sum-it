import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth/authentication.service';
import { UserInfo } from '../models/IUserInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { IUserAvatar } from '../models/IUserAvatar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  protected userInfo$: BehaviorSubject<UserInfo> = this.authService.userInfo$;

  ngOnInit() {
    this.authService.getUserInfo().subscribe();
  }

  logout() {
    this.authService
      .logout()
      .subscribe(() => this.router.navigateByUrl('home'));
  }

  async changeAvatar() {
    const image = await Camera.getPhoto({
      quality: 70,
      height: 320,
      width: 320,
      allowEditing: true,
      saveToGallery: false,
      resultType: CameraResultType.DataUrl,
    }).then((img) => {
      console.log(img)
      const userAvatar : IUserAvatar = {username : this.userInfo$.getValue().username, avatar: img.dataUrl}
      this.authService.updateAvatar(userAvatar).subscribe(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Avatar modifié',
          message: 'Votre avatar a été modifié',
          buttons: ['OK'],
        });
        this.userInfo$.next({...this.userInfo$.getValue(), avatar: img.dataUrl});
        await alert.present();
      });
    });
  }
}
