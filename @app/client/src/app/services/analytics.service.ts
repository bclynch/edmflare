import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ENV } from '../../environments/environment';

declare let ga: Function;

@Injectable()
export class AnalyticsService {

  constructor(
    private router: Router,
  ) {

  }

  trackViews() {
    if (ENV.production) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
        }
      });
    }
  }
}
