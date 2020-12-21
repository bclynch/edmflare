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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
  ]
})
export class EventsModule { }
