import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginGuardService as LoginGuard } from '../../services/loginGuard.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SocialLoginsModule } from '../social-logins/social-logins.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SocialLoginsModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class LoginModule { }
