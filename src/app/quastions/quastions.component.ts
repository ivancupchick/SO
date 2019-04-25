import { Component, OnInit } from '@angular/core';
import { QuationsService } from '../quations.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserInfo, Quastion } from '../mainClasses';

@Component({
  selector: 'app-quastions',
  templateUrl: './quastions.component.html',
  styleUrls: ['./quastions.component.css']
})
export class QuastionsComponent implements OnInit {

  questions: Quastion[];
  displayQuestions: Quastion[];
  userInfo: UserInfo;

  setting = true;
  isSorted = false;

  tags: string[];

  // filters

  isAnswered: string;
  isNotAnsweres = false;
  onModeration = false;
  myQuestions = false;
  tag1 = false;
  tag2 = false;
  tag3 = false;
  isFilterDate = false;
  dateFrom: Date;

  constructor(private dbService: QuationsService, private router: Router, private authService: AuthService) {
    this.dbService.getTagsValuesChanges().subscribe( (tags: string[]) => {
      this.tags = tags;
    });

    this.dbService.getQuastionsValuesChanges().subscribe(response => {
      this.displayQuestions = response;
      this.questions = response;
    });

    this.authService.linkUsers.valueChanges().subscribe( (users: UserInfo[]) => {
      users.forEach( (userInformation: UserInfo) => {
        if (this.authService.userId === userInformation.uid) {
          this.userInfo = userInformation;
        }
      });
    });
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

  linkToTag(tag: string) {
    console.log('link to ' + tag);
  }

  deleteQuestion(id: number) {
    this.dbService.deleteQuestion(id);
  }

  setTiles() {
    this.setting = true;
  }

  setLines() {
    this.setting = false;
  }

  sort() {
    this.isSorted = !this.isSorted;

    if (this.isSorted) {
      this.displayQuestions.sort( (element: Quastion, preElement: Quastion) => {
        if (preElement.dateOfCreation > element.dateOfCreation) {
          return 1;
        } else if (preElement.dateOfCreation < element.dateOfCreation) {
          return -1;
        }
      });
    } else {
      this.displayQuestions.sort( (element: Quastion, preElement: Quastion) => {
        if (preElement.dateOfCreation < element.dateOfCreation) {
          return 1;
        } else if (preElement.dateOfCreation > element.dateOfCreation) {
          return -1;
        }
      });
    }
    console.log(this.displayQuestions);
  }

  filter() {
    setTimeout( () => {
      this.filters();
    }, 100);
  }

  filters() {
    this.displayQuestions = [...this.questions];
    try {
      if (this.isAnswered === 'isAnswered') {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          if (question.answerID !== 0) {
            return true;
          }
          return false;
        });
      }
      if (this.isAnswered === 'isNotAnswered') {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          if (question.answerID === 0) {
            return true;
          }
          return false;
        });
      }
      if (this.onModeration) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          if (question.approved === false) {
            return true;
          }
          return false;
        });
      }
      if (this.myQuestions) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          if (question.author === this.userInfo.uid) {
            return true;
          }
          return false;
        });
      }
      if (this.tag1) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          let result = false;
          question.tags.forEach(element => {
            if (element === 'tag1') {
              result = true;
            }
          });
          return result;
        });
      }
      if (this.tag2) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          let result = false;
          question.tags.forEach(element => {
            if (element === 'tag2') {
              result = true;
            }
          });
          return result;
        });
      }
      if (this.tag3) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          let result = false;
          question.tags.forEach(element => {
            if (element === 'tag3') {
              result = true;
            }
          });
          return result;
        });
      }
      if (this.isFilterDate) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          const dateOfCreation = new Date(question.dateOfCreation);
          if (dateOfCreation > this.dateFrom) {
            return true;
          }
          return false;
        });
      }
    } catch {
      alert('You didn\'t logged'); // error message
    }
  }

  setPeriod(value: number) {
    let dateFrom = new Date();
    if (value === 0) {
      this.isFilterDate = false;
      this.filters();
    } else {
      this.isFilterDate = true;
      dateFrom.setDate(dateFrom.getDate() - value);
      this.dateFrom = dateFrom;
      this.filters();
    }
  }
}
