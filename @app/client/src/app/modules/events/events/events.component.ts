import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { RouterService } from 'src/app/services/router.service';
import { SearchEventsByCityGQL, SearchEventsByRegionGQL } from 'src/app/generated/graphql';
import { BehaviorSubject, SubscriptionLike } from 'rxjs';
import { DatesService } from 'src/app/services/dates.service';
import { UserService } from 'src/app/services/user.service';
import { AppService } from 'src/app/services/app.service';
import { FormControl } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { trigger } from '@angular/animations';
import { fadeOut } from '../fade-animations';
import { isPlatformBrowser } from '@angular/common';

class Event {
  id: string;
  name: string;
  startDate: number;
  ticketproviderurl: string;
  venue: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  animations: [
    trigger('fadeOut', fadeOut())
  ],
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport: CdkVirtualScrollViewport;

  collapsed = true;

  // search props
  location: string;
  dateRange: string;
  recentFilter: string;
  searchQueryControl = new FormControl();

  events: Event[] = [];
  eventsObservable = new BehaviorSubject<Event[]>([]);
  eventsInited = false;
  offset = 0;
  batchSize = 10;
  totalEvents;
  fetchingBatch = false;

  selectedLocation: string;


  initSubscription: SubscriptionLike;
  paramsSubscription: SubscriptionLike;

  ghosts = [];

  constructor(
    private routerService: RouterService,
    private searchEventsByCityGQL: SearchEventsByCityGQL,
    private searchEventsbyRegionGQL: SearchEventsByRegionGQL,
    private datesService: DatesService,
    private userService: UserService,
    private appService: AppService,
    private eventService: EventService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId
  ) {
    this.ghosts = new Array(4);       // Mock Ghost items
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          // if params change need to fire off a new search
          this.paramsSubscription = this.route.queryParams.subscribe((params) => {
            this.paramChangeHandler(params);
          });
          if (this.location) {
            // console.log('changing location');
            // this.changeUrlPath();
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  paramChangeHandler(params) {
    const { location, dates, query } = params;
    // grab location off cookie if not in url
    this.location = location || this.cookieService.get('edm-location');
    this.dateRange = dates || (params.new ? null : 'any');
    // if there is a date range in the query we didn't create it. Not using new filter then
    this.recentFilter = (!dates && params.new) || null;
    if (this.recentFilter) {
      // notification to user these are recent shows
      this.snackBar.open('New Shows Added Since Last Time', 'Close');
    }
    this.searchQueryControl.setValue(query || '');
    this.selectedLocation = this.location;
    this.appService.modPageMeta(`${this.selectedLocation} EDM Shows`, `Listing of upcoming edm events in ${this.selectedLocation}`);

    // reset events arr
    this.events = [];
    this.offset = 0;
    this.searchEvents();
  }

  searchEvents() {
    const range = this.datesService.calculateDateRange(this.dateRange);
    // if location does not exist then make empty arr
    if (!this.appService.locationsObj[this.selectedLocation]) {
      this.eventsObservable.next([]);
      this.eventsInited = true;
    } else {
      let queryParams: any = {
        query: this.searchQueryControl.value,
        userId: this.userService.user ? this.userService.user.id : 0,
        greaterThan: range.min.toString(),
        lessThan: range.max.toString(),
        batchSize: this.batchSize,
        offset: this.offset
      };
      const processData = (data, type) => {
        let totalCount, events;
        const { searchEventsByCity, searchEventsByRegion } = data;
        if (type === 'city') {
          totalCount = searchEventsByCity.totalCount;
          events = searchEventsByCity.nodes;
        } else {
          totalCount = searchEventsByRegion.totalCount;
          events = searchEventsByRegion.nodes;
        }
        this.ghosts = [];
        this.totalEvents = totalCount;
        this.events = this.events.concat(this.processEvents(events));
        this.eventsObservable.next(this.events);
        this.fetchingBatch = false;
        this.eventsInited = true;
        this.collapsed = true;
      };

      // having trouble rendering this SSR so let's just do it client for now
      if (isPlatformBrowser(this.platformId)) {
        // checking whether need to search cities or regions
        if (typeof this.appService.locationsObj[this.selectedLocation] === 'number') {
          queryParams = { ...queryParams, cityId: this.appService.locationsObj[this.selectedLocation] };
          this.searchEventsByCityGQL.fetch(queryParams).subscribe(
            ({ data }) => {
              processData(data, 'city');
            }
          );
        } else {
          queryParams = { ...queryParams, regionName: this.appService.locationsObj[this.selectedLocation] };
          this.searchEventsbyRegionGQL.fetch(queryParams).subscribe(
            ({ data }) => {
              processData(data, 'region');
            }
          );
        }
      }
    }
  }

  processEvents(events) {
    // identify if it is newly added
    const eventsCheckedNew = this.eventService.identifyNew(events);
    return eventsCheckedNew;
  }

  submitSearch(e) {
    e.preventDefault();

    this.changeUrlPath();
  }

  setLocation(location: string) {
    this.selectedLocation = location;
    this.location = location;

    // add location to cookie for future
    this.cookieService.set('edm-location', this.selectedLocation, null, null, null, false, 'Strict');
  }

  selectDate(date) {
    this.dateRange = date;
  }

  changeUrlPath() {
    this.eventsInited = false;
    // this.events = [];
    // this.eventsObservable.next(this.events);
    // this.ghosts = new Array(4);       // Mock Ghost items

    // add query params to address and also kicks off search events in the router subscription
    this.routerService.navigateToPage(
      '/events',
      {
        location: this.selectedLocation,
        dates: this.dateRange ? this.dateRange : null,
        query: this.searchQueryControl.value ? this.searchQueryControl.value : null,
        new: this.recentFilter ? this.recentFilter : null
      }
    );
  }

  nextBatch() {
    if (this.offset + this.batchSize >= this.totalEvents || this.fetchingBatch) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    // console.log(`${end}, '>=', ${total}`);
    if (total && end === total) {
      this.fetchingBatch = true;
      this.offset = this.offset + this.batchSize;
      this.searchEvents();
    }
  }
}
