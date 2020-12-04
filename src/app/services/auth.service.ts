import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from, of } from 'rxjs';
import { UserInfo } from '../mainClasses';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  userId: string;

  linkUsers: AngularFireList<UserInfo>;
  users: UserInfo[] = [];
  userInfo: UserInfo;
  usersLength: number;

  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    this.linkUsers = db.list('users');
    this.user = afAuth.authState;

    this.linkUsers.valueChanges()
      .subscribe(res => {
        this.users = res;
      });

    this.user.subscribe( (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.userInfo = this.receiveUserInfo();
  }

  private pushUserInfoToDB(credential: auth.UserCredential) { // users: UserInfo[]
    let count = true;
    this.users.forEach((user: UserInfo) => {
      if (user.uid === credential.user.uid) {
        count = false;
      }
    });

    if (count) {
      this.db.list('users').valueChanges().pipe(take(1)).subscribe(r => {
        this.usersLength = (r as []).length;

        this.db.list('users').push({
          uid: credential.user.uid,
          id: this.usersLength,
          role: 'User',
          name: credential.user.displayName || 'Anonymous',
          email: credential.user.email,
          photoUrl: credential.user.photoURL || 'https://material.angular.io/assets/img/examples/shiba1.jpg',
        });
      });
    }
  }

  getUser(): any {
    return this.afAuth.authState;
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  loginWithGoogle(): any {
    from(this.afAuth.auth.signInWithPopup( new auth.GoogleAuthProvider() )).subscribe(
      (credential) => {
        this.pushUserInfoToDB(credential);
      }, (error) => {
        throw new Error(error);
      }
    );
  }

  loginWithFacebook(): any {
    from(this.afAuth.auth.signInWithPopup( new auth.FacebookAuthProvider() )).subscribe(
      (credential) => {
        this.pushUserInfoToDB(credential);
      }, (error) => {
        throw new Error(error);
      }
    );
  }

  createUserWithEmail(email: string, password: string) {
    from(this.afAuth.auth.createUserWithEmailAndPassword(email, password)).subscribe(
      (credential) => {
        this.pushUserInfoToDB(credential);
      }, (error) => {
        throw new Error(error);
      }
    );
  }

  getCurrentUserInfo(): UserInfo {
    return this.userInfo;
  }

  receiveUserInfo(): UserInfo {
    const returnUserInfo = (uid: string) => {
      this.db.list('users').valueChanges().subscribe( (users: UserInfo[]) => {
        this.users = users;
        this.usersLength = users.length + 1;

        users.forEach(( userInfomation: UserInfo) => {
          if (uid === userInfomation.uid) {
            this.userInfo = userInfomation;
            return userInfomation;
          }
        });
      });
    };

    if (this.afAuth.authState) {
      this.afAuth.authState
        .subscribe( (user) => {
        if (user) {
          returnUserInfo(user.uid);
        }
      });
    }

    return this.userInfo;
  }

  getUserInfoFromDBWithUID(uid: string): UserInfo {
    let userResult: UserInfo;

    if (!this.users) {
      return ({} as UserInfo);
    }

    this.users.forEach(user => {
      if (user.uid === uid) {
        userResult = user;
      }
    });
    return userResult || ({} as UserInfo);
  }

  logOut(): void {
    this.userId = '';
    this.afAuth.auth.signOut();
  }

  get currentUserObservable(): Observable<User> {
    return this.afAuth.authState;
  }

  getUsersValueChanges() {
    return this.db.list('users').valueChanges();
  }
}
