import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

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
    SharedModule
  ]
})
export class UnsubscribeModule { }
