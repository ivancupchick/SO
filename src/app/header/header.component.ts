import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserInfo } from '../mainClasses';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userId: number;
  userInfo: UserInfo;


  constructor(private router: Router, public authService: AuthService, private dialog: MatDialog) {
    this.userInfo = this.authService.getCurrentUserInfo();
  }

  ngOnInit() {
  }

  openLogin() {
    this.dialog.open(LoginComponent);
  }
  openSignup() {
    this.dialog.open(SignupComponent);
  }

  linkToProfile() {
    if (!this.userInfo) {
      this.userInfo = this.authService.getCurrentUserInfo();
    }
    this.router.navigateByUrl(`profile/${this.userInfo.id}`);
  }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('');
  }
}
