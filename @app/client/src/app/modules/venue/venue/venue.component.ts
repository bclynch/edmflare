import { Component, OnInit, OnDestroy } from '@angular/core';
import { VenueByNameGQL } from 'src/app/generated/graphql';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import startOfDay from 'date-fns/start_of_day';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar
  ) {
    const venue = this.activatedRoute.snapshot.paramMap.get('venueName');
    this.appService.modPageMeta(`${venue} Venue Information`, `Check out upcoming shows, maps, and information for venue ${venue}`);
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.venueByNameGQL.fetch({
            name: venue,
            userId: this.userService.user ? this.userService.user.id : 0,
            currentDate: startOfDay(new Date()).valueOf()
          }).subscribe(
            ({ data }) => {
              this.venue = data.venue;
              console.log(this.venue);
            }
          );
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
