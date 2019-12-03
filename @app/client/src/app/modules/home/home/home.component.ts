import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';
import { CookieService } from 'ngx-cookie-service';
import { SearchEventsByCityGQL, SearchEventsByRegionGQL } from 'src/app/generated/graphql';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionLike } from 'rxjs';
import { faUsers, faBell, faCompactDisc } from '@fortawesome/free-solid-svg-icons';

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
      image: 'assets/images/splash1.jpg',
      tagline: 'The Next Rager'
    },
    {
      image: 'assets/images/splash2.jpg',
      tagline: 'Your New Favorite Artist'
    },
    {
      image: 'assets/images/splash3.jpg',
      tagline: 'Your Local Community'
    }
  ];
  activeSlide = 0;

  featuredEvents = [];

  features = [
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
      content: 'Get updates straight to your device about new shows coming to town. Whether you want an email once every few weeks or a notification to your phone every day, we\'ve got you covered. <a href="/signup">Sign up</a> to get started.'
    },
  ];

  initSubscription: SubscriptionLike;

  constructor(
    private routerService: RouterService,
    private cookieService: CookieService,
    private searchEventsByCityGQL: SearchEventsByCityGQL,
    private searchEventsByRegionGQL: SearchEventsByRegionGQL,
    private appService: AppService,
    private userService: UserService,
    private utilService: UtilService
  ) {
    this.appService.modPageMeta('Discover EDM events, information, and community', `EDM Flare is the most comprehensive and easy to use source for all things edm`);

    // queue up carousel
    setInterval(() => this.activeSlide = this.activeSlide === this.carouselSlides.length - 1 ? 0 : this.activeSlide += 1, 10000 );

    const location = this.cookieService.get('edm-location');
    if (location) {
      this.selectedLocation = location;
    } else {
      // default location for users
      this.cookieService.set('edm-location', 'New York');
      this.selectedLocation = 'New York';
    }

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          // fetch featured
          const range = this.utilService.calculateDateRange('any');
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
              ({ data }) => this.featuredEvents = data.searchEventsByCity.nodes
            );
          } else {
            queryParams = { ...queryParams, regionName: this.appService.locationsObj[this.selectedLocation] };
            this.searchEventsByRegionGQL.fetch(queryParams).subscribe(
              ({ data }) => this.featuredEvents = data.searchEventsByRegion.nodes
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

  searchShows(e) {
    e.preventDefault();

    // add location to cookie for future
    this.cookieService.set('edm-location', this.selectedLocation);

    this.routerService.navigateToPage('/events', { location: this.selectedLocation, dates: this.dateRange });
  }

  setLocation(location: string) {
    console.log(location);
    this.selectedLocation = location;
  }
}
