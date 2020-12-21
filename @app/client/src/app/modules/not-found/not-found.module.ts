import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    CloudinaryModule
  ],
  declarations: [NotFoundComponent]
})
export class NotFoundModule { }
