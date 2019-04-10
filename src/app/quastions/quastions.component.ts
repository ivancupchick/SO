import { Component, OnInit } from '@angular/core';
import { QuationsService } from '../quations.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserInfo, Quastion } from '../mainClasses';
import { forEach } from '@angular/router/src/utils/collection';
import { of } from 'rxjs';

@Component({
  selector: 'app-quastions',
  templateUrl: './quastions.component.html',
  styleUrls: ['./quastions.component.css']
})
export class QuastionsComponent implements OnInit {

  quastions: Quastion[];
  userInfo: UserInfo;

  constructor(private dbService: QuationsService, router: Router, private authService: AuthService) {
    this.dbService.getQuastionsValuesChanges().subscribe(response => {
      this.quastions = response;
    });
    this.userInfo = this.authService.getCurrentUserInfo();
  }

  ngOnInit() {
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
    this.dbService.approveQuastion(id);
  }

  formatDate(dateInMs: number) {
    const dateOfCreation: Date = new Date(dateInMs);
    let day: string = '' + dateOfCreation.getDate();
    if (+day < 10) { day = '0' + day; }
    let month: string = '' + dateOfCreation.getMonth();
    if (+month < 10) { month = '0' + month; }
    return `${day}.${month}.${dateOfCreation.getFullYear()}`;
  }

  formatTags(tagsArray: string[]) {
    if (tagsArray.length === 0) {
      return '';
    }
    let result: string = '' + tagsArray[0];
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
    this.dbService.deleteQuestion(id);
  }
}
