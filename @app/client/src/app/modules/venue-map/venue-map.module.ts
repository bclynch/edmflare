import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueMapComponent } from './venue-map/venue-map.component';
import { AgmCoreModule } from '@agm/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    VenueMapComponent
  ],
  imports: [
    CommonModule,
    AgmCoreModule,
    MatIconModule
  ],
  exports: [VenueMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VenueMapModule { }
