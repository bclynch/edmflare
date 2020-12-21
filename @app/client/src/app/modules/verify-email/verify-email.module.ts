import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

const routes: Routes = [
  {
    path: '',
    component: VerifyEmailComponent
  }
];

@NgModule({
  declarations: [VerifyEmailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CloudinaryModule
  ]
})
export class VerifyEmailModule { }
