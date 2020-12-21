import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { DisqusModule } from 'ngx-disqus';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { VenueMapModule } from '../venue-map/venue-map.module';
import { MatIconModule } from '@angular/material/icon';
import { EventbriteService } from '../eventbrite-checkout/eventbrite.service';
import { ShareDialogueModule } from '../share-dialogue/share-dialogue.module';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: ':eventId',
    component: EventComponent
  }
];

@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    DisqusModule,
    VenueMapModule,
    MatIconModule,
    ShareDialogueModule,
    MatDialogModule
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
    EventbriteService
  ]
})
export class EventModule { }
