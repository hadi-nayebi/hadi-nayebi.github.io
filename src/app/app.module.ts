import { AuthService } from 'src/app/service/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { HomepageComponent } from './components/homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './components/projects/projects.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './service/auth-guard.service';
import { UserService } from './service/user.service';
import { OwnerAuthGuard } from './service/owner-auth-guard.service';
import { MagnetComponent } from './components/projects/magnet/magnet.component';
import { PlsComponent } from './components/projects/pls/pls.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MainNavComponent,
    LoginComponent,
    ProjectsComponent,
    LandingPageComponent,
    MagnetComponent,
    PlsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot([
      { path: '', component: LandingPageComponent },
      {
        path: 'home',
        component: HomepageComponent,
        canActivate: [AuthGuard, OwnerAuthGuard],
      },
      { path: 'login', component: LoginComponent },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard, OwnerAuthGuard],
      },
      {
        path: 'projects/magnet',
        component: MagnetComponent,
        canActivate: [AuthGuard, OwnerAuthGuard],
      },
      {
        path: 'projects/pls',
        component: PlsComponent,
        canActivate: [AuthGuard, OwnerAuthGuard],
      },
    ]),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [AuthService, AuthGuard, UserService, OwnerAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
