import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from '@angular/fire/database';
import { Comment, Quastion } from '../mainClasses';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class QuationsService {
  comments: Comment[];
  commentNextNumber: number;

  quastions: Quastion[];
  quastionNextNumber: number;

  tags: string[];

  constructor(public db: AngularFireDatabase) {
    setTimeout( () => {
      this.db.list<Quastion>('quastions').valueChanges().subscribe( (quastions: Quastion[]) => {
        this.quastions = quastions;
      });

      this.db.list('comments').valueChanges().subscribe( (comments: Comment[]) => {
        this.comments = comments;
      });

      this.db.list('tags').valueChanges().subscribe( (tags: string[]) => {
        this.tags = tags;
      });
    }, 7);
  }

  sendQuastion(quastion: Quastion): void {
    quastion.id = this.quastions ? this.quastions.length || 0 : 0;

    this.db.list('quastions').push(quastion);
  }

  sendComment(comment: Comment): void {
    comment.id = this.comments ? this.comments.length || 0 : 0;

    this.db.list('comments').push(comment);
  }


  getQuations() {
    return this.quastions;
  }

  getQuastionsValuesChanges() {
    return this.db.list('quastions').valueChanges();
  }

  getCommentsValuesChanges() {
    return this.db.list('comments').valueChanges();
  }

  getTagsValuesChanges() {
    return this.db.list('tags').valueChanges();
  }

  getComments() {
    return this.comments;
  }

  pushTags(tags: string[]) {
    const alreadyExistTags: string[] = [];
    this.tags.forEach((tagFromDB: string) => {
      tags.forEach( (tagFromCommit: string) => {
        if (tagFromDB === tagFromCommit) {
          alreadyExistTags.push(tagFromDB);
        }
      });
    });
    tags.filter( (tag) => {
      let result = true;
      if (alreadyExistTags) {
        alreadyExistTags.forEach( (tagForRemove) => {
          if (tag === tagForRemove) {
            result = false;
          }
        });
      }
      return result;
    });
    console.log(alreadyExistTags);
    console.log(tags);

    tags.forEach(tag => {
      this.db.list('tags').push(tag);
    });
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
      this.db.list('quastions').update(key, {
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

    this.db.list('quastions').snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
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

      this.db.list('quastions').set(key, {
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

    this.db.list('quastions').snapshotChanges().forEach( (changes) => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
        if (response.payload.val().id === id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }

  deleteQuestion(id: number) {
    const removeQuestionComments = (questionId: number) => {
      this.db.list('comments').snapshotChanges().forEach( changes => {
        changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Comment>>) => {
          if (response.payload.val().quastionId === questionId) {
            this.deleteComment(response.payload.val().id);
          }
        });
      });
    };

    this.db.list('quastions').snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
          if (response.payload.val().id === id)  {
          this.db.list('quastions').remove(response.key);
          removeQuestionComments(id);
        }
      });
    });
  }

  deleteComment(id: number) {
    this.db.list('comments').snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Comment>>) => {
          if (response.payload.val().id === id)  {
          this.db.list('comments').remove(response.key);
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

      this.db.list('quastions').set(key, questionForSend);
    };
    console.log(id, questionForSend);
    this.db.list('quastions').snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
          if (response.payload.val().id === +id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }
}
