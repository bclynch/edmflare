import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';
import { SettingsWrapperModule } from '../settings-wrapper/settings-wrapper.module';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    SettingsWrapperModule
  ]
})
export class UserProfileModule { }
