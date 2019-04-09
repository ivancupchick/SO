import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean | any {
      if (this.auth.isAuthenticated()) { return true; } else {
        console.log('Acces denied!');
        this.router.navigateByUrl('');
        return false;
      }
    }
}
