import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueComponent } from './venue/venue.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { VenueMapModule } from '../venue-map/venue-map.module';
import { EventCardModule } from '../event-card/event-card.module';

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
    PageWrapperModule,
    VenueMapModule,
    EventCardModule
  ]
})
export class VenueModule { }
