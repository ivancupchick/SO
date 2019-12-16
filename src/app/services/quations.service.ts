import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot, AngularFireList } from '@angular/fire/database';
import { Comment, Quastion } from '../mainClasses';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class QuationsService {
  comments: Comment[];
  commnetsRef: AngularFireList<Comment> = this.db.list('comments');
  commentNextNumber: number;

  quastions: Quastion[];
  questionsRef: AngularFireList<Quastion> = this.db.list('quastions');
  quastionNextNumber: number;

  tagsRef: AngularFireList<string> = this.db.list('tags');
  tags: string[];

  constructor(public db: AngularFireDatabase) {
    setTimeout( () => {
      this.questionsRef.valueChanges()
        .pipe(
          map(res => {
            res = res.filter(res1 => !res1.deleted);

            return res;
          })
        )
        .subscribe( (quastions: Quastion[]) => {
          this.quastions = quastions;
        });

      this.commnetsRef.valueChanges()
        .pipe(
          map(res => {
            res = res.filter(res1 => !res1.deleted);

            return res;
          })
        )
        .subscribe( (comments: Comment[]) => {
          this.comments = comments;
        });

      this.tagsRef.valueChanges()
        .subscribe( (tags: string[]) => {
          this.tags = tags;
        });
    }, 7);
  }

  sendQuastion(quastion: Quastion): void {
    quastion.id = this.quastions ? this.quastions.length || 0 : 0;

    this.questionsRef.push(quastion);
  }

  sendComment(comment: Comment): void {
    comment.id = this.comments ? (this.comments.length + 1) || 1 : 1;

    this.commnetsRef.push(comment);
  }


  getQuations() {
    return this.quastions;
  }

  getQuastionsValuesChanges() {
    return this.questionsRef.valueChanges()
      .pipe(
        map(res => {
          res = res.filter(res1 => !res1.deleted);

          return res;
        })
      );
  }

  getCommentsValuesChanges() {
    return this.commnetsRef.valueChanges()
      .pipe(
        map(res => {
          res = res.filter(res1 => !res1.deleted);

          return res;
        })
      );
  }

  getTagsValuesChanges() {
    return this.tagsRef.valueChanges();
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

    tags = tags.filter( (tag) => {
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

    // if (this,tags.)

    tags.forEach(tag => {
      this.tagsRef.push(tag);
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
      console.log(approvedQuastion);
      this.questionsRef.set(key, {
        approved: true,
        title: approvedQuastion.title,
        id: approvedQuastion.id,
        tags: approvedQuastion.tags,
        description: approvedQuastion.description,
        author: approvedQuastion.author,
        dateOfCreation: approvedQuastion.dateOfCreation,
        answerID: approvedQuastion.answerID || 0,
        deleted: approvedQuastion.deleted || false
      });
    };

    this.questionsRef.snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
          if (response.payload.val().id === id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }

  markAnswer(id: number, commentId: number) {
    console.log(commentId);
    const sendApproveQuestion = (key: string) => {
      let approvedQuastion: Quastion;
      this.quastions.forEach((quastion: Quastion) => {
        if (quastion.id === id) {
          approvedQuastion = quastion;
        }
      });

      this.questionsRef.set(key, {
        approved: approvedQuastion.approved,
        title: approvedQuastion.title,
        id: approvedQuastion.id,
        tags: approvedQuastion.tags,
        description: approvedQuastion.description,
        author: approvedQuastion.author,
        dateOfCreation: approvedQuastion.dateOfCreation,
        answerID: commentId,
        deleted: approvedQuastion.deleted
      });
    };

    this.questionsRef.snapshotChanges().forEach( (changes) => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
        if (response.payload.val().id === id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }

  deleteQuestion(id: number) {
    // const removeQuestionComments = (questionId: number) => {
    //   this.commnetsRef.snapshotChanges().forEach( changes => {
    //     changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Comment>>) => {
    //       if (response.payload.val().quastionId === questionId) {
    //         this.deleteComment(response.payload.val().id);
    //       }
    //     });
    //   });
    // };

    this.questionsRef.snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
          if (response.payload.val().id === id)  {
            this.questionsRef.set(response.key, {
              approved: response.payload.val().approved,
              title: response.payload.val().title,
              id: response.payload.val().id,
              tags: response.payload.val().tags,
              description: response.payload.val().description,
              author: response.payload.val().author,
              dateOfCreation: response.payload.val().dateOfCreation,
              answerID: response.payload.val().answerID,
              deleted: true
            });
          // this.questionsRef.remove(response.key);
          // removeQuestionComments(id);
        }
      });
    });
  }

  deleteComment(id: number) {
    this.commnetsRef.snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Comment>>) => {
          if (response.payload.val().id === id)  {
            this.commnetsRef.set(response.key, {
              id: response.payload.val().id,
              quastionId: response.payload.val().quastionId,
              description: response.payload.val().description,
              author: response.payload.val().author,
              dateOfCreation: response.payload.val().dateOfCreation,
              deleted: false
            });
          // this.commnetsRef.remove(response.key);
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

      this.questionsRef.set(key, questionForSend);
    };
    console.log(id, questionForSend);
    this.questionsRef.snapshotChanges().forEach( changes => {
      changes.forEach( (response: AngularFireAction<DatabaseSnapshot<Quastion>>) => {
          if (response.payload.val().id === +id)  {
          sendApproveQuestion(response.key);
        }
      });
    });
  }
}
