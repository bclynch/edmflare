import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ENV } from '../../environments/environment';

// Third party modules
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ShareModule } from '@ngx-share/core';
import { AgmCoreModule } from '@agm/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { OverlayContainer, FullscreenOverlayContainer } from '@angular/cdk/overlay';

// components
import { PagewrapperComponent } from './pagewrapper/pagewrapper.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DirectivesModule } from '../directives/directives.module';
import { LocationSearchComponent } from './location-search/location-search.component';
import { EventCardComponent } from './event-card/event-card.component';
import { ShareDialogueComponent } from './share-dialogue/share-dialogue.component';
import { VenueMapComponent } from './venue-map/venue-map.component';
import { EventbriteCheckoutComponent } from './eventbrite-checkout/eventbrite-checkout.component';
import { SelectDateComponent } from './select-date/select-date.component';
import { EventCardAltComponent } from './event-card-alt/event-card-alt.component';
import { SettingsWrapperComponent } from './settings-wrapper/settings-wrapper.component';
import { GetAppComponent } from './get-app/get-app.component';
import { SocialLoginsComponent } from './social-logins/social-logins.component';
import { NotificationPreferencesComponent } from './notification-preferences/notification-preferences.component';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faRedditAlien } from '@fortawesome/free-brands-svg-icons/faRedditAlien';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons/faFacebookMessenger';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons/faTelegramPlane';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';

@NgModule({
  entryComponents: [
    ShareDialogueComponent,
    EventbriteCheckoutComponent,
  ],
  declarations: [
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    LocationSearchComponent,
    EventCardComponent,
    ShareDialogueComponent,
    VenueMapComponent,
    EventbriteCheckoutComponent,
    SelectDateComponent,
    EventCardAltComponent,
    SettingsWrapperComponent,
    GetAppComponent,
    SocialLoginsComponent,
    NotificationPreferencesComponent,
    ThemeToggleComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTabsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatChipsModule,
    DirectivesModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ShareModule,
    AgmCoreModule.forRoot({
      apiKey: ENV.googleAPIKey,
    }),
    FontAwesomeModule
  ],
  exports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTabsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatChipsModule,
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    LocationSearchComponent,
    EventCardComponent,
    VenueMapComponent,
    SelectDateComponent,
    EventCardAltComponent,
    SettingsWrapperComponent,
    GetAppComponent,
    SocialLoginsComponent,
    NotificationPreferencesComponent,
    ThemeToggleComponent
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
  ]
})
export class SharedModule {
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
