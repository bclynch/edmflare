import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardAltComponent } from './event-card-alt/event-card-alt.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareDialogueModule } from '../share-dialogue/share-dialogue.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

@NgModule({
  declarations: [
    EventCardAltComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    FontAwesomeModule,
    ShareDialogueModule,
    MatSnackBarModule,
    CloudinaryModule
  ],
  exports: [EventCardAltComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventCardAltModule { }
