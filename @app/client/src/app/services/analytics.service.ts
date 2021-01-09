import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ENV } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

declare let ga: Function;

@Injectable()
export class AnalyticsService {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {

  }

  trackViews() {
    if (ENV.production && isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
  }
}
