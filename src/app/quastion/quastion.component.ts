import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuationsService } from '../quations.service';
import { User } from 'firebase/app';
import { AuthService } from '../auth.service';
import { UserInfo } from '../mainClasses';

@Component({
  selector: 'app-quastion',
  templateUrl: './quastion.component.html',
  styleUrls: ['./quastion.component.css']
})
export class QuastionComponent implements OnInit {

  quastionId: number;
  quastion: any;
  user: User;
  userInfo: UserInfo;

  comments: any[] = [];

  constructor(private route: ActivatedRoute,
              private dbServise: QuationsService,
              private authService: AuthService) {
    route.params.subscribe( (id) => {
      console.log(id.id);
      this.quastionId = id.id;
    });

    this.userInfo = this.authService.getCurrentUserInfo();

    dbServise.getQuastionsValuesChanges().subscribe( response => {
      response.forEach(quastion => {
        if (quastion.id === +this.quastionId) {
          console.log(quastion);
          this.quastion = quastion;
        }
      });
    });

    authService.getUser().subscribe( user => {
      this.user = user;
    });

    this.dbServise.getCommentsValuesChanges().subscribe(response => {
      response.forEach(comment => {
        console.log(comment);
        if (comment.quastionId === this.quastionId) {
          this.comments[this.comments.length] = comment;
          // Array.call(this.comments, comment);
          // this.comments.push(comment);
          console.log(this.comments);
        }
      });
    });
  }

  onSubmit(formData) {
    const now = new Date();
    console.log(formData.value);
    this.dbServise.sendComment({
      id: 0,
      description: formData.value.commentDescription,
      quastionId: this.quastionId,
      author: this.user.uid,
      dataOfCreation: +now,
    });
  }

  showUserEmail(uid: string) {
    return this.authService.getUserInfoFromDBWithUID(uid).email;
  }

  showUserPhotoURL(uid: string) {
    return this.authService.getUserInfoFromDBWithUID(uid).photoUrl;
  }

  showUserName(uid: string) {
    return this.authService.getUserInfoFromDBWithUID(uid).name;
  }

  ngOnInit() {
  }
}
