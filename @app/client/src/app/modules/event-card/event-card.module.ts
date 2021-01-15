import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardComponent } from './event-card/event-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShareDialogueModule } from '../share-dialogue/share-dialogue.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ShareService } from '../../services/share.service';

@NgModule({
  declarations: [
    EventCardComponent
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
  providers: [ShareService],
  exports: [EventCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventCardModule { }
