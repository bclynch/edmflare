import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { VenueByNameGQL } from 'src/app/generated/graphql';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import startOfDay from 'date-fns/startOfDay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit, OnDestroy {

  venue;

  initSubscription: SubscriptionLike;

  constructor(
    private venueByNameGQL: VenueByNameGQL,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId,
    private transferState: TransferState
  ) {
    const venue = this.activatedRoute.snapshot.paramMap.get('venueName');
    this.appService.modPageMeta(`${venue} Venue Information`, `Check out upcoming shows, maps, and information for venue ${venue}`);

    const VENUE_KEY = makeStateKey(`venue-${venue}`);

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          if (this.transferState.hasKey(VENUE_KEY)) {
            const venueData = this.transferState.get(VENUE_KEY, null);
            this.transferState.remove(VENUE_KEY);
            this.venue = venueData;
          } else {
            this.venueByNameGQL.fetch({
              name: venue,
              userId: this.userService.user ? this.userService.user.id : 0,
              currentDate: startOfDay(new Date()).valueOf()
            }).subscribe(
              ({ data: { venue: venueData } = {} }) => {
                this.venue = venueData;
                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(VENUE_KEY, venueData);
                }
              }
            );
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  followVenue() {
    this.userService.follow(null, this.venue.name, this.venue.name).then(
      ({ data: id, message }) => {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
        this.venue.followLists.nodes = [{ id }];
      }
    );
  }

  unfollowVenue() {
    this.userService.unfollow(this.venue.followLists.nodes[0].id).then(
      () => this.venue.followLists.nodes = []
    );
  }
}
