import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { NotificationPreferencesModule } from '../notification-preferences/notification-preferences.module';
import { GetAppModule } from '../get-app/get-app.module';
import { ThemeToggleModule } from '../theme-toggle/theme-toggle.module';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: UserSetupComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [UserSetupComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    CloudinaryModule,
    NotificationPreferencesModule,
    GetAppModule,
    ThemeToggleModule,
    MatButtonModule
  ]
})
export class UserSetupModule { }
