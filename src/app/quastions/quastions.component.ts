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
  tagsSelected: string[] = [];
  allTags: string[] = [];

  questions: Quastion[];
  displayQuestions: Quastion[];
  userInfo: UserInfo;

  setting = true;
  isSorted = false;


  // filters
  isAnswered: string = 'none';
  onModeration = false;
  myQuestions = false;
  isFilterDate = false;
  dateFrom: Date;

  constructor(private dbService: QuationsService, private router: Router, private authService: AuthService) {
    this.dbService.getTagsValuesChanges().subscribe( (tags: string[]) => {
      this.allTags = tags;
    });

    this.dbService.getQuastionsValuesChanges().subscribe(response => {
      response.map((question: Quastion) => {
        if (!question.tags) {
          question.tags = [];
        }
      });
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
    this.tagsSelected.push(tag);
    this.tagsSelected = this.tagsSelected.concat([])
    this.filters();
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
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => question.answerID !== 0);
      }
      if (this.isAnswered === 'isNotAnswered') {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => question.answerID === 0);
      }
      if (this.onModeration) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => question.approved === false);
      }
      if (this.myQuestions) {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => question.author === this.userInfo.uid);
      }
      this.tagsSelected.forEach( (tag) => {
        this.displayQuestions = this.displayQuestions.filter( (question: Quastion) => {
          return question.tags.some(element => element === tag);
        });
      });
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
