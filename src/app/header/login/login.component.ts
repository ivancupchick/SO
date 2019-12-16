import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public state = '';
  public error: any;

  constructor(public authService: AuthService, private matDialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit() {
  }

  onSubmit(formData) {
    this.authService.loginWithEmail(formData.value.email, formData.value.password) // formData.value.name
      .subscribe(success => {
        console.log(success);
        this.hide();
      }, error => {
        console.log(error);
        this.error = error;
      });
  }

  loginFacebook() {
    let result = this.authService.loginWithFacebook();
    if (!result) {
      this.hide();
    } else {
      this.error = result;
    }
  }

  loginGoogle() {
    let result = this.authService.loginWithGoogle();
    if (!result) {
      this.hide();
    } else {
      this.error = result;
    }
  }

  hide() {
    this.matDialogRef.close();
  }
}
