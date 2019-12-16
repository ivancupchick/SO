import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfo } from '../mainClasses';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  state = '';

  userInfo: UserInfo;

  constructor(private route: ActivatedRoute, public authService: AuthService, private router: Router) {
    authService.getUser().subscribe(auth => {
      if (auth) {
        this.user = auth;
      }
    });

    this.userInfo = this.authService.getCurrentUserInfo();

    this.route.params.subscribe(params => {
      console.log(params);
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigateByUrl('');
  }

  deleteUser() {
    this.router.navigateByUrl('');
  }

  linktoEditProfile() {
    this.router.navigateByUrl('editProfile');
  }

  ngOnInit() {
  }

}
