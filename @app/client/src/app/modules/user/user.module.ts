import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { EventCardAltModule } from '../event-card-alt/event-card-alt.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

const routes: Routes = [
  {
    path: ':username',
    component: UserComponent
  }
];

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    EventCardAltModule,
    CloudinaryModule
  ]
})
export class UserModule { }
