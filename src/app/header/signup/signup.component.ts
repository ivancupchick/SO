import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public state = '';
  public error: any;

  constructor(public authService: AuthService, private matDialogRef: MatDialogRef<SignupComponent>) { }

  onSubmit(formData) {
    if(formData.valid) {
      try {
        this.authService.createUserWithEmail(formData.value.email, formData.value.password);
      } catch (error) {
        console.log(error);
      }
    }

  /*
    if(formData.valid) {
      let result =
      if (!result) {
        this.hide();
      } else {
        this.error = result;
      }
    }
    */
  }

  signupFacebook() {
    let result = this.authService.loginWithFacebook();
    if (!result) {
      this.hide();
    } else {
      this.error = result;
    }
  }

  signupGoogle() {
    let result = this.authService.loginWithGoogle();
    if (!result) {
      this.hide();
    } else {
      this.error = result;
    }
  }

  ngOnInit() {
  }

  hide() {
    this.matDialogRef.close();
  }

}
