import { Directive, NgZone, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UtilService } from '../../services/util.service';
import { GlobalObjectService } from '../../services/globalObject.service';

@Directive({ selector: '[appScroll]' })
export class ScrollDirective implements OnInit, OnDestroy {
  windowRef;

  private eventOptions: boolean|{capture?: boolean, passive?: boolean};
  private priorScrollValue;
  scrollDirection: 'up' | 'down' = null;

  constructor(
    private ngZone: NgZone,
    private utilService: UtilService,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = this.globalObjectService.getWindow();
    this.priorScrollValue = isPlatformBrowser(this.platformId)
      ? this.windowRef.pageYOffset || this.windowRef.document.documentElement.scrollTop
      : 0;
  }

  ngOnInit() {
    // check support for passive event listener
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      if (isPlatformBrowser(this.platformId)) {
        this.windowRef.addEventListener('test', null, opts);
      }
    } catch (e) {}

    if (supportsPassive) {
        this.eventOptions = {
            capture: true,
            passive: true
        };
    } else {
        this.eventOptions = true;
    }

    this.ngZone.runOutsideAngular(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.windowRef.addEventListener('scroll', this.scroll, <any>this.eventOptions);
      }
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
    }
  }

  scroll = (e): void => {
    const scrollDirection: 'up' | 'down' = e.target.scrollTop > this.priorScrollValue ? 'down' : 'up';

    // if new direction is different from old run change detection && if past 40px (height of nav bar)
    if (this.scrollDirection !== scrollDirection && e.target.scrollTop > 40) {
      this.scrollDirection = scrollDirection;
      this.ngZone.run(() => {
        this.utilService.scrollDirection = scrollDirection;
      });
    }

    this.priorScrollValue = e.target.scrollTop;

    if (this.utilService.checkScrollInfinite && !this.utilService.allFetched) {
      // console.log(e);
      const heightFromBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight);
      if (heightFromBottom < 150 && this.scrollDirection === 'down' && !this.utilService.infiniteActive) {
        this.utilService.toggleInfiniteActive(true);
      }
    }
  }
}
