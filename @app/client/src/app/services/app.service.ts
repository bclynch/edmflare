import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AllLocationsGQL, CreatePushSubscriptionGQL } from '../generated/graphql';
import { BehaviorSubject, Observable} from 'rxjs';
import { AnalyticsService } from './analytics.service';
import { UserService } from './user.service';
import { ThemeService } from './theme.service';
import { Title, Meta } from '@angular/platform-browser';
import { SwPush } from '@angular/service-worker';
import { UtilService } from './util.service';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from './globalObject.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class AppService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;
  locationRef;

  // used in location search component
  locations: string[] = [];
  locationsObj = {};
  locationDirectory = [];

  readonly VAPID_PUBLIC_KEY = 'BCcrOxeXijgM9gmGD8_lfxo-mC2qKL3XKwFgYyTtETro2aTTZLXpbB4LLM0uihjLBD-3loEzDB3vBDt5Vko-eiU';
  readonly logoUrl = 'https://edm-flare.s3.amazonaws.com/logos/icon-512x512.png';

  constructor(
    private allLocationsGQL: AllLocationsGQL,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private titleService: Title,
    private meta: Meta,
    private swPush: SwPush,
    private createPushSubscriptionGQL: CreatePushSubscriptionGQL,
    private utilService: UtilService,
    private themeService: ThemeService,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;
    this.locationRef = this.globalObjectService.getLocation();

    // init tracking
    this.analyticsService.trackViews();

    // kick in the theme
    this.themeService.getUserTheme();
  }

  appInit() {
    this.userService.fetchUser().then(
      () => {
        this.fetchAllLocations().then(
          () => {
            this._subject.next(true);
          }
        );
      }
    );
  }

  fetchAllLocations() {
    return new Promise<void>((resolve, reject) => {
      const LOCATIONS_KEY = makeStateKey('app-locations');
      if (this.transferState.hasKey(LOCATIONS_KEY)) {
        const regions = this.transferState.get(LOCATIONS_KEY, null);
        this.transferState.remove(LOCATIONS_KEY);
        this.processLocations(regions);
        resolve();
      } else {
        this.allLocationsGQL.fetch().subscribe(
          ({ data: { regions } = {} }) => {
            if (isPlatformServer(this.platformId)) {
              this.transferState.set(LOCATIONS_KEY, regions);
            }
            this.processLocations(regions);
            resolve();
          },
          (err) => reject(err)
        );
      }
    });
  }

  processLocations(regions) {
    // creating an array of strings with both cities + regions
    const locationsArr = [];
    this.locationDirectory = regions.nodes;
    for (const { name, citiesByRegion } of regions.nodes) {
      this.locationsObj[name] = name;
      locationsArr.push(name);

      for (const city of citiesByRegion.nodes) {
        if (locationsArr.indexOf(city.name) === -1) {
          locationsArr.push(city.name);
          this.locationsObj[city.name] = city.id;
        }
      }
    }
    this.locations = locationsArr;
  }

  modPageMeta(title: string, description: string) {
    // TODO figure this out SSR. Probably not need this at all anymore
    const href = isPlatformBrowser(this.platformId)
      ? this.locationRef.href
      : '';
    this.meta.removeTag('name="description"');
    this.titleService.setTitle(`${title} | EDM Flare`);
    this.meta.addTag({ name: 'description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
    this.meta.addTag({ name: 'og:url', content: href });
    this.meta.addTag({ name: 'og:title', content: `${title} | EDM Flare`});
    this.meta.addTag({ name: 'og:description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
    this.meta.addTag({ name: 'twitter:url', content: href });
    this.meta.addTag({ name: 'twitter:title', content: `${title} | EDM Flare`});
    this.meta.addTag({ name: 'twitter:description', content: `${description}. Discover upcoming edm shows where you live and get in touch with the local community.`});
  }

  subscribeToPushNotifications() {
    return new Promise<void>((resolve, reject) => {
      this.swPush.requestSubscription({ serverPublicKey: this.VAPID_PUBLIC_KEY })
        .then((sub) => {
          // save sub to the db
          this.createPushSubscriptionGQL.mutate({
            userId: this.userService.user.id,
            endpoint: sub.endpoint,
            p256Dh: this.utilService.arrayBufferToBase64(sub.getKey('p256dh')),
            auth: this.utilService.arrayBufferToBase64(sub.getKey('auth'))
          })
            .subscribe(
              () => resolve(),
              err => reject(err)
            );
        })
        .catch((err) => reject(err)
      );
    });
  }

  unsubscribeToPushNotifications() {
    return new Promise<void>((resolve, reject) => {
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
