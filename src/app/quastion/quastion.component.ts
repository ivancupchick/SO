import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuationsService } from '../services/quations.service';
import { User } from 'firebase/app';
import { AuthService } from '../services/auth.service';
import { UserInfo, Comment, Quastion } from '../mainClasses';

@Component({
  selector: 'app-quastion',
  templateUrl: './quastion.component.html',
  styleUrls: ['./quastion.component.css']
})
export class QuastionComponent implements OnInit {
  quastionId: number;
  quastion: Quastion;
  user: User;
  userInfo: UserInfo;

  comments: Comment[] = [];

  constructor(private route: ActivatedRoute,
              private dbServise: QuationsService,
              private authService: AuthService) {
    route.params.subscribe( (id) => {
      this.quastionId = +id.id;
    });

    this.userInfo = this.authService.getCurrentUserInfo();

    dbServise.getQuastionsValuesChanges().subscribe( response => {
      response.forEach( (quastion: Quastion) => {
        if (quastion.id === +this.quastionId) {
          this.quastion = quastion;
        }
      });
    });

    authService.getUser().subscribe( (user: User) => {
      this.user = user;
    });

    this.dbServise.getCommentsValuesChanges().subscribe(response => {
      response.forEach( (comment: Comment) => {
        console.log(comment);
        if (comment.quastionId === this.quastionId) {
          this.comments[this.comments.length] = comment;
        }
      });
    });
  }

  onSubmit(formData: any) {
    const now = new Date();
    console.log(formData.value);
    this.dbServise.sendComment({
      id: 0,
      description: formData.value.commentDescription,
      quastionId: +this.quastionId,
      author: this.user.uid,
      dateOfCreation: +now,
      deleted: false
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

  approveQuestion(id: number) {
    this.dbServise.approveQuastion(id);
  }

  formatTags(tagsArray: string[]) {
    if (tagsArray.length === 0) {
      return '';
    }
    let result = `${tagsArray[0]}`;
    tagsArray.forEach( (element: string, i: number) => {
      if (i !== 0) {
        if (element) {
          result += ` | ${element}`;
        }
      }
    });
    return result;
  }

  deleteQuestion(id: number) {
    this.dbServise.deleteQuestion(id);
  }

  deleteComment(id: number) {
    this.dbServise.deleteComment(id);
  }

  markComment(id: number) {
    this.dbServise.markAnswer(id, this.quastionId);
  }

  ngOnInit() {
  }
}
