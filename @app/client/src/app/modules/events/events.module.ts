import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GhostListComponent } from './events/ghost/ghost-list.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { LocationSearchModule } from '../location-search/location-search.module';
import { EventCardModule } from '../event-card/event-card.module';
import { SelectDateModule } from '../select-date/select-date.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { DatesService } from '../../services/dates.service';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  }
];

@NgModule({
  declarations: [EventsComponent, GhostListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    CloudinaryModule,
    LocationSearchModule,
    EventCardModule,
    SelectDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule
  ],
  providers: [
    DatesService
  ]
})
export class EventsModule { }
