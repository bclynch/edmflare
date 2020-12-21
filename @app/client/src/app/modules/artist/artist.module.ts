import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistComponent } from './artist/artist.component';
import { Routes, RouterModule } from '@angular/router';
import { PageWrapperModule } from '../page-wrapper/page-wrapper.module';
import { EventCardModule } from '../event-card/event-card.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: ':artistName',
    component: ArtistComponent
  }
];

@NgModule({
  declarations: [ArtistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PageWrapperModule,
    FontAwesomeModule,
    EventCardModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class ArtistModule { }
