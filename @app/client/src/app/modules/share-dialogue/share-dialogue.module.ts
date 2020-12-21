import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareDialogueComponent } from './share-dialogue/share-dialogue.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons/faRedditAlien';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons/faFacebookMessenger';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons/faTelegramPlane';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

@NgModule({
  declarations: [
    ShareDialogueComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ShareButtonsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [ShareDialogueComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareDialogueModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFacebookF,
      faTwitter,
      faRedditAlien,
      faWhatsapp,
      faFacebookMessenger,
      faTelegramPlane,
      faEnvelope,
      faCommentAlt
    );
  }
}
