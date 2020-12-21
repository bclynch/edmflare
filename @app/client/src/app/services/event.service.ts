import { Injectable } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { CreateWatchListGQL, RemoveWatchlistGQL } from '../generated/graphql';
import { UserService } from './user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class EventService {

  overlayRef: OverlayRef;

  constructor(
    private createWatchListGQL: CreateWatchListGQL,
    private removeWatchListGQL: RemoveWatchlistGQL,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  addWatch(eventId): Promise<number> {
    return new Promise((resolve) => {
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
    return new Promise<void>((resolve) => {
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
