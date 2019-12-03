import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationExtras } from '@angular/router';
import { filter } from 'rxjs/operators';

// Services
import { UtilService } from '../services/util.service';
import { SubscriptionLike } from 'rxjs';

@Injectable()
export class RouterService implements OnDestroy {

  paramsSubscription: SubscriptionLike;
  fragmentSubscription: SubscriptionLike;
  eventsSubscription: SubscriptionLike;

  params;
  fragment;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilService: UtilService
  ) {
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      this.params = params;
    });
    this.fragmentSubscription = this.route.fragment.subscribe((fragment) => {
      this.fragment = fragment;
    });
    // this.eventsSubscription = this.router.events.pipe(
    //   filter((event) => event instanceof NavigationStart))
    //   .subscribe((event) => {
    //     this.utilService.checkScrollInfinite = false;
    //   });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.fragmentSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  grabBaseRoute(url: string): string {
    let baseUrl: string;
    // means there is at least one param or no fragment
    // therefore we need to split at the '?' to grab everything before the query params (which will always be before the fragments)
    if (Object.keys(this.params)[0] || !this.fragment) {
      baseUrl = url.split('?')[0];
    } else {
      // means none of either or fragment
      // therefore we need to split at the '#' to grab all before fragment (or it'll just split nothing)
      baseUrl = url.split('#')[0];
    }
    return baseUrl;
  }

  modifyQueryParams(fileTypes, tags) {
    const params: any = {};
    if (fileTypes.length) {
      params.fileTypes = fileTypes;
    }
    // will likely need to do something with these different filters
    if (tags.length) {
      params.tags = tags;
    }

    // maintain search query if it exists
    if (this.params.q) {
      params.q = this.params.q;
    }

    const paramsObj = { queryParams : params };

    const url = this.grabBaseRoute(this.router.url);
    this.router.navigate([url], paramsObj);
  }

  modifyFragment(fragment: string, url?: string) {
    const navigationExtras: NavigationExtras = {
      fragment
    };

    const currentURL = url ? url : this.grabBaseRoute(this.router.url);
    this.router.navigate([currentURL], navigationExtras);
  }

  navigateToPage(path: string, query?: {}) {
    const queryParams = {queryParams: query ? query : null};

    this.router.navigate([path], queryParams);
  }
}
