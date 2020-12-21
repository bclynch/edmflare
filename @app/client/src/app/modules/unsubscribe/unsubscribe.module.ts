import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '',
    component: UnsubscribeComponent
  }
];

@NgModule({
  declarations: [UnsubscribeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  PageWrapperModule,
    CloudinaryModule,
    MatSnackBarModule
  ]
})
export class UnsubscribeModule { }
