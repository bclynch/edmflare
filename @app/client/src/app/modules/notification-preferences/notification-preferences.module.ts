import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPreferencesComponent } from './notification-preferences/notification-preferences.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';

const routes: Routes = [
  {
    path: '',
    component: NotificationPreferencesComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [NotificationPreferencesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule
  ]
})
export class NotificationPreferencesModule { }
