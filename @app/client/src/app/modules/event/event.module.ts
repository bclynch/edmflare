import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event/event.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { DisqusModule } from 'ngx-disqus';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { VenueMapModule } from '../venue-map/venue-map.module';
import { EventbriteService } from '../eventbrite-checkout/eventbrite.service';
import { ShareDialogueModule } from '../share-dialogue/share-dialogue.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

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
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTooltipModule,
    CloudinaryModule
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
    EventbriteService
  ]
})
export class EventModule { }
