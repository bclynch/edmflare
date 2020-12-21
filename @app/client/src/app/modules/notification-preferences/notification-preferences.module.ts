import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationPreferencesComponent } from './notification-preferences/notification-preferences.component';
import { NotificationPreferencesFormComponent } from './notification-preferences-form/notification-preferences-form.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { FormsModule } from '@angular/forms';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { LocationSearchModule } from '../location-search/location-search.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SettingsWrapperModule } from '../settings-wrapper/settings-wrapper.module';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '',
    component: NotificationPreferencesComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [NotificationPreferencesComponent, NotificationPreferencesFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    FormsModule,
    LocationSearchModule,
    MatChipsModule,
    MatCheckboxModule,
    SettingsWrapperModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ],
  exports: [
    NotificationPreferencesFormComponent
  ]
})
export class NotificationPreferencesModule { }
