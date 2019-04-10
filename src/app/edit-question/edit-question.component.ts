import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { QuationsService } from '../quations.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  questionId: number;
  question: any;

  comments: any[] = [];

  title: string;
  description: string;
  tag1: boolean;
  tag2: boolean;
  tag3: boolean;

  constructor(private route: ActivatedRoute,
              private dbServise: QuationsService) {
    route.params.subscribe( (param) => {
      this.questionId = param.id;
    });

    dbServise.getQuastionsValuesChanges().subscribe( response => {
      response.forEach(question => {
        if (question.id === +this.questionId) {
          console.log(question);
          this.question = question;

          this.description = question.description;
          this.title = question.title;

          question.tags.forEach(element => {
            if (element === 'tag1') {
              this.tag1 = true;
            } else if (element === 'tag2') {
              this.tag2 = true;
            } else if (element === 'tag3') {
              this.tag3 = true;
            }
          });
        }
      });
    });
  }

  updateQuestion() {
    const tagsForSend: string[] = [];
    if (this.tag1) { tagsForSend.push('tag1'); }
    if (this.tag2) { tagsForSend.push('tag2'); }
    if (this.tag3) { tagsForSend.push('tag3'); }
    console.log(tagsForSend);
    this.dbServise.editQuestion(this.questionId, {
      id: +this.questionId,
      approved: this.question.approved,
      title: this.title,
      description: this.description,
      tags: tagsForSend,
      author: this.question.author,
      dateOfCreation: this.question.dateOfCreation,
      answerID: this.question.answerID,
    });
  }

  ngOnInit() {
  }

}
