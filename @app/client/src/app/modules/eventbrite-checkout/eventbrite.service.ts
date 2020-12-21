import { Injectable, Injector } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { EventbriteCheckoutComponent } from './eventbrite-checkout/eventbrite-checkout.component';
import { CONTAINER_DATA } from './eventbrite-checkout/eventbrite-overlay.token';

@Injectable()
export class EventbriteService {

  overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {

  }

  eventbriteCheckout(eventId: number) {
    this.overlayRef = this.overlay.create();
    const eventbritePortal = new ComponentPortal(EventbriteCheckoutComponent, null, this.createInjector({
      eventId
    }));
    this.overlayRef.attach(eventbritePortal);
  }

  private createInjector(dataToPass): PortalInjector {
    const injectorTokens = new WeakMap();
    injectorTokens.set(CONTAINER_DATA, dataToPass);
    return new PortalInjector(this.injector, injectorTokens);
  }
}
