import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from, of } from 'rxjs';
import { UserInfo } from './mainClasses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  userId: string;

  linkUsers: any;
  users: UserInfo[];
  userInfo: UserInfo;
  usersLength: number;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.linkUsers = db.list('users');
    this.user = afAuth.authState;

    this.user.subscribe( (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });

    this.userInfo = this.receiveUserInfo();
  }

  private pushUserInfoToDB(credential: auth.UserCredential) { // users: UserInfo[]
    let count = true;
    this.users.forEach( (user: UserInfo) => {
      if (user.uid === credential.user.uid) {
        count = false;
      }
    });
    if (count) {
      console.log('User sending to db...'); // delete this line
      this.linkUsers.push({
        uid: credential.user.uid,
        id: this.usersLength,
        role: 'User',
        name: credential.user.displayName || 'Anonymous',
        email: credential.user.email,
        photoUrl: credential.user.photoURL || 'https://material.angular.io/assets/img/examples/shiba1.jpg',
      });
    }
  }

  deleteUser(): Observable<any> {
    return from(this.afAuth.auth.currentUser.delete()); // not work
  }

  getUser(): any {
    return this.user;
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

  getObservableCurrentUserInfo(): Observable<UserInfo> {
    this.linkUsers.valueChanges().subscribe( (users: UserInfo[]) => {
      this.users = users;
      this.usersLength = users.length + 1;

      users.forEach(( userInfomation: UserInfo) => {
        if (this.userId === userInfomation.uid) {
          this.userInfo = userInfomation;
          return of(userInfomation);
        }
      });
    });
    return of(this.userInfo);
  }

  receiveUserInfo(): UserInfo {
    this.linkUsers.valueChanges().subscribe( (users: UserInfo[]) => {
      this.users = users;
      this.usersLength = users.length + 1;

      users.forEach(( userInfomation: UserInfo) => {
        if (this.userId === userInfomation.uid) {
          this.userInfo = userInfomation;
          return userInfomation;
        }
      });
    });
    return this.userInfo;
  }

  getUserInfoFromDBWithUID(uid: string): UserInfo {
    let userResult: UserInfo;
    this.users.forEach(user => {
      if (user.uid === uid) {
        userResult = user;
      }
    });
    return userResult;
  }

  logOut(): void {
    this.userId = '';
    this.afAuth.auth.signOut();
  }

  get currentUserObservable(): Observable<User> {
    return this.afAuth.authState;
  }
}
