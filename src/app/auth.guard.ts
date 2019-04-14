import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      console.log(this.auth.authenticated);
      if (this.auth.authenticated) {
        return true;
      }
      /*
      if (!this.auth.isAuthenticated()) {
        console.log('Acces denied!');
        this.router.navigateByUrl('');
      }
      */
      return this.auth.currentUserObservable.pipe(
        take(1),
        map(user => {
            console.log('user: ', user);
            return !!user;
        }),
        tap( loggedIn => {
            console.log('loggedIn: ', loggedIn);
            if (!loggedIn) {
                console.log('access denied');
                //this.router.navigate(['/login']);
            }
        })
      );
      /*
      if (this.auth.isAuthenticated()) { return of(true); } else {
        console.log('Acces denied!');
        this.router.navigateByUrl('');
        return of(false);
      }
      */
    }
}
