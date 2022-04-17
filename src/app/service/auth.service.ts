import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { GoogleAuthProvider, User } from 'firebase/auth';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from 'rxjs/operators';
import { AppUser } from '../models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$!: Observable<User>;
  userCredentials$;
  constructor(
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.user$ = <Observable<User>>afAuth.authState;
    this.userCredentials$ = afAuth.credential;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    return this.afAuth.signInWithRedirect(new GoogleAuthProvider());
  }

  logout() {
    this.afAuth.signOut();
  }

  isNewUser() {
    return this.userCredentials$.pipe(
      map((userCredential) => {
        if (userCredential?.additionalUserInfo?.isNewUser) return true;
        return false;
      })
    );
  }
}
