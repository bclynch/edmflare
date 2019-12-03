import { Injectable, Injector } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { EventbriteCheckoutComponent } from '../shared/eventbrite-checkout/eventbrite-checkout.component';
import { CONTAINER_DATA } from '../shared/eventbrite-checkout/eventbrite-overlay.token';
import { CreateWatchListGQL, RemoveWatchlistGQL } from '../generated/graphql';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class EventService {

  overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private injector: Injector,
    private createWatchListGQL: CreateWatchListGQL,
    private removeWatchListGQL: RemoveWatchlistGQL,
    private userService: UserService,
    private snackBar: MatSnackBar
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

  addWatch(eventId): Promise<number> {
    return new Promise((resolve, reject) => {
      if (this.userService.user) {
        this.createWatchListGQL.mutate({ userId: this.userService.user.id, eventId }).subscribe(
          ({ data }) => resolve(data.createWatchList.watchList.id)
        );
      } else {
        this.snackBar.open('Login to your account to add to watch list', 'Close', {
          duration: 3000,
        });
        resolve(null);
      }
    });
  }

  removeWatch(watchListId) {
    return new Promise((resolve, reject) => {
      this.removeWatchListGQL.mutate({ watchListId }).subscribe(
        () => resolve()
      );
    });
  }

  identifyNew(events) {
    // how many days to be considered 'new'
    const days = 5;
    const msPerDay = 86400000;

    return events.map((event) => {
      const eventCopy = { ...event };
      eventCopy['new'] = (Date.now() - +event.createdAt) < (msPerDay * days);
      return eventCopy;
    });
  }
}
