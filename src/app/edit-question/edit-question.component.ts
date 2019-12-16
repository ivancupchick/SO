import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { QuationsService } from '../services/quations.service';
import { Quastion, Comment } from '../mainClasses';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  questionId: number;
  question: Quastion;

  comments: Comment[] = [];

  title: string;
  description: string;

  constructor(private route: ActivatedRoute,
              private dbServise: QuationsService) {
    route.params.subscribe( (param) => {
      this.questionId = param.id;
    });

    dbServise.getQuastionsValuesChanges().subscribe( response => {
      response.forEach( (question: Quastion) => {
        if (question.id === +this.questionId) {
          console.log(question);
          this.question = question;

          this.description = question.description;
          this.title = question.title;
        }
      });
    });
  }

  updateQuestion() {
    const tagsForSend: string[] = [];
    console.log(tagsForSend);
    this.dbServise.editQuestion(this.questionId, {
      id: +this.questionId,
      approved: this.question.approved,
      title: this.title,
      description: this.description,
      tags: this.question.tags,
      author: this.question.author,
      dateOfCreation: this.question.dateOfCreation,
      answerID: this.question.answerID,
      deleted: this.question.deleted
    });
  }

  ngOnInit() {
  }

}
