import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordForgotComponent } from './password-forgot/password-forgot.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PasswordForgotComponent
  }
];

@NgModule({
  declarations: [PasswordForgotComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PasswordForgotModule { }
