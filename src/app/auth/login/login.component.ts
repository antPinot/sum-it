import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Credentials } from 'src/app/models/ICredentials';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  loginForm!: FormGroup;

  credentials: Credentials = {
    username:'',
    password:''
  };

  constructor(private formBuilder: FormBuilder, private storageService : StorageService, private authService : AuthenticationService, private router : Router){}


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username : [null, Validators.required],
      password : [null, Validators.required]
    })
  }

  onSubmitForm(){
    this.credentials.username = this.loginForm.value.username;
    this.credentials.password = this.loginForm.value.password;
    this.authService.login(this.credentials).subscribe(() => {
      this.router.navigate(['/profile'])
    })
  }

  onCheckAuth(){
    this.authService.checkAuthentication().subscribe((username) => console.log(username));
  }


}
