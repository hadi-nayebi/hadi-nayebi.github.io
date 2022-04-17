import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OwnerAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$
      .pipe(switchMap((user) => this.userService.get(user.uid).valueChanges()))
      .pipe(
        map((appUser) => {
          if (!appUser?.isOwner) {
            alert('No public pages at the moment');
            return false;
          }
          return appUser!.isOwner;
        })
      );
  }
}
