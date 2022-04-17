import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private userService: UserService,
    private auth: AuthService,
    router: Router
  ) {
    this.auth.user$.subscribe((user: User) => {
      if (user) {
        this.userService.save(user);
        // let returnUrl = localStorage.getItem('returnUrl');
        // router.navigateByUrl(returnUrl);
        router.navigate(['/home']);
      } else {
        router.navigate(['/login']);
      }
    });
  }
}
