import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GhostListComponent } from './events/ghost/ghost-list.component';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

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
    SharedModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    CloudinaryModule
  ]
})
export class EventsModule { }
