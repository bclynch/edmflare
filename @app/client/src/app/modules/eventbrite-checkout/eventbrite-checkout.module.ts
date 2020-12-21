import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventbriteCheckoutComponent } from './eventbrite-checkout/eventbrite-checkout.component';

@NgModule({
  declarations: [
    EventbriteCheckoutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [EventbriteCheckoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventbriteCheckoutModule { }
