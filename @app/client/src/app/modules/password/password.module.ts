import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordComponent } from './password/password.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { SettingsWrapperModule } from '../settings-wrapper/settings-wrapper.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  {
    path: '',
    component: PasswordComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsWrapperModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class PasswordModule { }
