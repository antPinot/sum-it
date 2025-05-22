import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Keyboard } from '@capacitor/keyboard';
import { Credentials } from 'src/app/models/ICredentials';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  private static readonly MARGIN_DEFAULT: string = '60% 5%';
  private static readonly MARGIN_KEYBOARD: string = '20% 5%';

  margin: string = AuthPageComponent.MARGIN_DEFAULT;

  title: string = 'Connexion';

  isLogin!: boolean;

  authForm!: FormGroup;

  credentials: Credentials = {} as Credentials;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLogin = this.router.url.includes('login');
    this.authForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
    if (!this.isLogin) {
      this.authForm.addControl(
        'mail',
        new FormControl(null, [Validators.required, Validators.email])
      );
      //A refactorer avec une méthode util
      this.title = 'Inscription ';
    }
    //On pousse le card de connexion vers le haut à l'affichage du clavier
    Keyboard.addListener(
      'keyboardWillShow',
      () => (this.margin = AuthPageComponent.MARGIN_KEYBOARD)
    );
    //On pousse le card de connexion vers le bas à la disparition du clavier
    Keyboard.addListener(
      'keyboardWillHide',
      () => (this.margin = AuthPageComponent.MARGIN_DEFAULT)
    );
  }

  onSubmitForm() {
    this.credentials.username = this.authForm.value.username;
    if (this.authForm.value.mail)
      this.credentials.mail = this.authForm.value.mail;
    this.credentials.password = this.authForm.value.password;
    this.authService
      .loginOrRegister(this.credentials, this.isLogin)
      .subscribe(() => {
        this.router.navigate(['/profile']);
      });
  }
}
