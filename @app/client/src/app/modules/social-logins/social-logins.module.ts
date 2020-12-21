import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginsComponent } from './social-logins/social-logins.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    SocialLoginsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  exports: [SocialLoginsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SocialLoginsModule { }
