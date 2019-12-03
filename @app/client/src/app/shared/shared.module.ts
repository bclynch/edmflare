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
import { ShareButtonsModule } from '@ngx-share/buttons';
import { AgmCoreModule } from '@agm/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    GetAppComponent
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
    DirectivesModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ShareButtonsModule,
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
    PagewrapperComponent,
    FooterComponent,
    NavbarComponent,
    LocationSearchComponent,
    EventCardComponent,
    VenueMapComponent,
    SelectDateComponent,
    EventCardAltComponent,
    SettingsWrapperComponent,
    GetAppComponent
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
  ]
})
export class SharedModule { }
