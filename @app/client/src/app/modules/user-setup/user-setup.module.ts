import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';

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
    SharedModule
  ]
})
export class UserSetupModule { }
