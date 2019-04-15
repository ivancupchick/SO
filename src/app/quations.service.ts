import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Comment, Quastion, LengthNumber } from './mainClasses';

@Injectable({
  providedIn: 'root'
})
export class QuationsService {
  comments: Comment[];
  linkComments: AngularFireList<Comment>;
  commentNextNumber: number;

  quastions: Quastion[];
  linkQuastions: AngularFireList<Quastion>;
  quastionNextNumber: number;

  constructor(public db: AngularFireDatabase) {
    this.linkQuastions = db.list('quastions');
    this.linkComments = db.list('comments');
    const linkCommentsNextNumber = db.object('commentNextNumber');
    const linkQuastionNextNumber = db.object('quastionNextNumber');

    linkCommentsNextNumber.valueChanges().subscribe( (response: LengthNumber) => {
      console.log(response.value);
      this.commentNextNumber = response.value;
    });

    linkQuastionNextNumber.valueChanges().subscribe( (response: LengthNumber) => {
      console.log(response.value);
      this.quastionNextNumber = response.value;
    });


    this.linkQuastions.valueChanges().subscribe( (quastions: Quastion[]) => {
      this.quastions = quastions;
    });

    this.linkComments.valueChanges().subscribe( (comments: Comment[]) => {
      this.comments = comments;
    });
  }

  sendQuastion(quastion: Quastion): void {
    quastion.id = this.quastionNextNumber;
    this.db.object('quastionNextNumber').set({ value: quastion.id + 1});
    this.linkQuastions.push(quastion);
  }

  sendComment(comment: Comment): void {
    comment.id = this.commentNextNumber;
    this.db.object('commentNextNumber').set({ value: comment.id + 1});
    this.linkComments.push(comment);
  }


  getQuations() {
    return this.quastions;
  }

  getQuastionsValuesChanges() {
    return this.linkQuastions.valueChanges();
  }

  getCommentsValuesChanges() {
    return this.linkComments.valueChanges();
  }

  getComments() {
    return this.comments;
  }

  approveQuastion(id: number) {
    const sendApproveQuestion = (key: string) => {
      let approvedQuastion: Quastion;
      this.quastions.forEach((question: Quastion) => {
        if (question.id === id) {
          approvedQuastion = question;
        }
      });

      approvedQuastion.approved = true;
      this.linkQuastions.update(key, {
        approved: true,
        title: approvedQuastion.title,
        id: approvedQuastion.id,
        tags: approvedQuastion.tags,
        description: approvedQuastion.description,
        author: approvedQuastion.author,
        dateOfCreation: approvedQuastion.dateOfCreation,
        answerID: approvedQuastion.answerID,
      });
    };

    this.linkQuastions.snapshotChanges().forEach( changes => {
      changes.forEach( response => {
          if (response.payload.val().id === id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }

  markAnswer(id: number, commentId: number) {
    const sendApproveQuestion = (key: string) => {
      let approvedQuastion: Quastion;
      this.quastions.forEach((quastion: Quastion) => {
        if (quastion.id === id) {
          approvedQuastion = quastion;
        }
      });

      this.linkQuastions.set(key, {
        approved: approvedQuastion.approved,
        title: approvedQuastion.title,
        id: approvedQuastion.id,
        tags: approvedQuastion.tags,
        description: approvedQuastion.description,
        author: approvedQuastion.author,
        dateOfCreation: approvedQuastion.dateOfCreation,
        answerID: commentId,
      });
    };

    this.linkQuastions.snapshotChanges().forEach( (changes) => {
      changes.forEach( response => {
        if (response.payload.val().id === id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }

  deleteQuestion(id: number) {
    const removeQuestionComments = (questionId: number) => {
      this.linkComments.snapshotChanges().forEach( changes => {
        changes.forEach( response => {
          if (response.payload.val().quastionId === questionId) {
            this.deleteComment(response.payload.val().id);
          }
        });
      });
    };

    this.linkQuastions.snapshotChanges().forEach( changes => {
      changes.forEach( response => {
          if (response.payload.val().id === id)  {
          this.linkQuastions.remove(response.key);
          removeQuestionComments(id);
        }
      });
    });
  }

  deleteComment(id: number) {
    this.linkComments.snapshotChanges().forEach( changes => {
      changes.forEach( response => {
          if (response.payload.val().id === id)  {
          this.linkComments.remove(response.key);
        }
      });
    });
  }

  editQuestion(id: number, questionForSend: Quastion) {
    const sendApproveQuestion = (key: string) => {
      let approvedQuastion: Quastion;
      this.quastions.forEach((question: Quastion) => {
        if (question.id === +id) {
          approvedQuastion = question;
        }
      });

      this.linkQuastions.set(key, questionForSend);
    };
    console.log(id, questionForSend);
    this.linkQuastions.snapshotChanges().forEach( changes => {
      changes.forEach( response => {
          if (response.payload.val().id === +id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }
}
