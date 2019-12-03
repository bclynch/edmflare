import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueComponent } from './venue/venue.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: ':venueName',
    component: VenueComponent
  }
];

@NgModule({
  declarations: [VenueComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class VenueModule { }
