import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginGuardService as LoginGuard } from '../../services/loginGuard.service';
import { SocialLoginsModule } from '../social-logins/social-logins.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: SignupComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    ReactiveFormsModule,
    FormsModule,
    SocialLoginsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SignupModule { }
