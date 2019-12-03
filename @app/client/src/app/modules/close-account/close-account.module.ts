import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseAccountComponent } from './close-account/close-account.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AnonGuardService as AnonGuard } from '../../services/anonGuard.service';

const routes: Routes = [
  {
    path: '',
    component: CloseAccountComponent,
    canActivate: [AnonGuard]
  }
];

@NgModule({
  declarations: [CloseAccountComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CloseAccountModule { }
