import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseAccountComponent } from './close-account/close-account.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { SettingsWrapperModule } from '../settings-wrapper/settings-wrapper.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: CloseAccountComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [CloseAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    SettingsWrapperModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class CloseAccountModule { }
