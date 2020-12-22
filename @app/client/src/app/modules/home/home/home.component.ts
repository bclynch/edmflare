import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { CookieService } from 'ngx-cookie-service';
import { SearchEventsByCityGQL, SearchEventsByRegionGQL, LiveStreamsGQL } from '../../../generated/graphql';
import { AppService } from '../../../services/app.service';
import { UserService } from '../../../services/user.service';
import { DatesService } from '../../../services/dates.service';
import { SubscriptionLike } from 'rxjs';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons/faCompactDisc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedLocation: string;
  dateRange = 'any';

  carouselSlides = [
    {
      image: 'https://edm-flare.s3.amazonaws.com/splash/splash1.jpg',
      tagline: 'The Next Rager'
    },
    {
      image: 'https://edm-flare.s3.amazonaws.com/splash/splash2.jpg',
      tagline: 'Your New Favorite Artist'
    },
    {
      image: 'https://edm-flare.s3.amazonaws.com/splash/splash3.jpg',
      tagline: 'Your Local Community'
    }
  ];
  activeSlide = 0;

  featuredEvents = [];

  features = [];

  initSubscription: SubscriptionLike;

  constructor(
    private routerService: RouterService,
    private cookieService: CookieService,
    private searchEventsByCityGQL: SearchEventsByCityGQL,
    private searchEventsByRegionGQL: SearchEventsByRegionGQL,
    private appService: AppService,
    private userService: UserService,
    private datesService: DatesService,
    private liveStreamsGQL: LiveStreamsGQL
  ) {
    this.appService.modPageMeta('Discover EDM events, information, and community', `EDM Flare is the most comprehensive and easy to use source for all things edm`);

    // queue up carousel
    setInterval(() => {
      const lastSlide = this.activeSlide === this.carouselSlides.length - 1;
      this.activeSlide = lastSlide ? 0 : this.activeSlide += 1;
    }, 10000 );

    const location = this.cookieService.get('edm-location');
    if (location) {
      this.selectedLocation = location;
    } else {
      // default location for users
      this.cookieService.set('edm-location', 'New York', null, null, null, false, 'Strict');
      this.selectedLocation = 'New York';
    }

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.features = [
            {
              icon: faCompactDisc,
              header: 'Discover New Artists',
              content: 'It\'s impossible to stay up to date with all the new artists on the scene, but we can help. In addition to checking out upcoming shows see artist bios, social media, and music to see if they are the DJ you\'re looking for.'
            },
            {
              icon: faUsers,
              header: 'Find Community',
              content: 'Got questions about a gig coming up? Leave a comment and get help from fellow EDM Flare users on event and venue pages with tips and answers to help make your show a smooth, memorable time.'
            },
            {
              icon: faBell,
              header: 'Get Updates On New Shows',
              content: `Get updates straight to your device about new shows coming to town. Whether you want an email once every few weeks or a notification to your phone every day, we\'ve got you covered. ${this.userService.user ? '' : '<a href="/signup">Sign up</a> to get started.'}`
            }
          ];
          // fetch featured
          const range = this.datesService.calculateDateRange('any');
          let queryParams: any = {
            query: '',
            userId: this.userService.user ? this.userService.user.id : 0,
            greaterThan: range.min.toString(),
            lessThan: range.max.toString(),
            batchSize: 12
          };
          if (typeof this.appService.locationsObj[this.selectedLocation] === 'number') {
            queryParams = { ...queryParams, cityId: this.appService.locationsObj[this.selectedLocation] };
            this.searchEventsByCityGQL.fetch(queryParams).subscribe(
              ({ data }) => {
                const localEvents = data.searchEventsByCity.nodes;
                this.fetchLiveStreams(localEvents, queryParams);
              }
            );
          } else {
            queryParams = { ...queryParams, regionName: this.appService.locationsObj[this.selectedLocation] };
            this.searchEventsByRegionGQL.fetch(queryParams).subscribe(
              ({ data }) => {
                const localEvents = data.searchEventsByRegion.nodes;
                this.fetchLiveStreams(localEvents, queryParams);
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

  fetchLiveStreams(localEvents, queryParams) {
    this.liveStreamsGQL.fetch(queryParams).subscribe(
      ({ data }) => {
        const liveStreamEvents = data.events.nodes;
        const allEvents = [ ...localEvents, ...liveStreamEvents ];
        const sortedEvents = allEvents.sort((a, b) => a.startDate - b.startDate);
        this.featuredEvents = sortedEvents.slice(0, 12);
      });
  }

  searchShows(e) {
    e.preventDefault();

    // add location to cookie for future
    this.cookieService.set('edm-location', this.selectedLocation, null, null, null, false, 'Strict');

    this.routerService.navigateToPage('/events', { location: this.selectedLocation, dates: this.dateRange });
  }

  setLocation(location: string) {
    this.selectedLocation = location;
  }
}
