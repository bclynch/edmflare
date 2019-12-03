import { Injectable } from '@angular/core';
import { AllLocationsGQL, CreatePushSubscriptionGQL } from '../generated/graphql';
import { BehaviorSubject, Observable} from 'rxjs';
import { AnalyticsService } from './analytics.service';
import { UserService } from './user.service';
import { ThemeService } from './theme.service';
import { Title, Meta } from '@angular/platform-browser';
import { SwPush } from '@angular/service-worker';
import { UtilService } from './util.service';
import * as moment from 'moment';

@Injectable()
export class AppService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;

  // used in location search component
  locations: string[];
  locationsObj = {};
  locationDirectory;

  readonly VAPID_PUBLIC_KEY = 'BCcrOxeXijgM9gmGD8_lfxo-mC2qKL3XKwFgYyTtETro2aTTZLXpbB4LLM0uihjLBD-3loEzDB3vBDt5Vko-eiU';

  constructor(
    private allLocationsGQL: AllLocationsGQL,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private titleService: Title,
    private meta: Meta,
    private swPush: SwPush,
    private createPushSubscriptionGQL: CreatePushSubscriptionGQL,
    private utilService: UtilService,
    private themeService: ThemeService
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;

    // init tracking
    this.analyticsService.trackViews();

    // kick in the theme
    this.themeService.getUserTheme();
  }

  appInit() {
    this.userService.fetchUser().then(
      () => {
        this.fetchAllLocations().then(
          () => this._subject.next(true)
        );
      }
    );
  }

  fetchAllLocations() {
    return new Promise((resolve, reject) => {
      this.allLocationsGQL.fetch({ currentDate: moment().startOf('day').valueOf() }).subscribe(
        ({ data }) => {
          // creating an array of strings with both cities + regions
          const locationsArr = [];
          this.locationDirectory = data.regions.nodes;
          for (const region of data.regions.nodes) {
            this.locationsObj[region.name] = region.name;
            locationsArr.push(region.name);

            for (const city of region.citiesByRegion.nodes) {
              if (locationsArr.indexOf(city.name) === -1) {
                locationsArr.push(city.name);
                this.locationsObj[city.name] = city.id;
              }
            }
          }
          this.locations = locationsArr;
          resolve();
        }
      );
    });
  }

  modPageMeta(title: string, description: string) {
    this.meta.removeTag('name="description"');
    this.titleService.setTitle(`${title} | EDM Flare`);
    this.meta.addTag({ name: 'description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
    this.meta.addTag({ name: 'og:url', content: window.location.href });
    this.meta.addTag({ name: 'og:title', content: `${title} | EDM Flare`});
    this.meta.addTag({ name: 'og:description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
    this.meta.addTag({ name: 'twitter:url', content: window.location.href });
    this.meta.addTag({ name: 'twitter:title', content: `${title} | EDM Flare`});
    this.meta.addTag({ name: 'twitter:description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
  }

  subscribeToPushNotifications() {
    return new Promise((resolve, reject) => {
      this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
        .then((sub) => {
          console.log(sub);
          // save sub to the db
          this.createPushSubscriptionGQL.mutate({
            userId: this.userService.user.id,
            endpoint: sub.endpoint,
            p256Dh: this.utilService.arrayBufferToBase64(sub.getKey('p256dh')),
            auth: this.utilService.arrayBufferToBase64(sub.getKey('auth'))
          })
            .subscribe(
              (result) => resolve(),
              err => reject(err)
            );
        })
        .catch((err) => reject(err)
      );
    });
  }

  unsubscribeToPushNotifications() {
    return new Promise((resolve, reject) => {
      this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
        .then((sub) => {
          sub.unsubscribe().then(
            () => resolve()
          );
        })
        .catch((err) => reject(err)
      );
    });
  }
}
