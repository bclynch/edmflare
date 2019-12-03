import { Directive, NgZone, OnInit, OnDestroy } from '@angular/core';

import { UtilService } from '../../services/util.service';

@Directive({ selector: '[appScroll]' })
export class ScrollDirective implements OnInit, OnDestroy {

  private eventOptions: boolean|{capture?: boolean, passive?: boolean};
  private priorScrollValue = window.pageYOffset || document.documentElement.scrollTop;
  scrollDirection: 'up' | 'down' = null;

  constructor(
    private ngZone: NgZone,
    private utilService: UtilService
  ) {

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
      window.addEventListener('test', null, opts);
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
      window.addEventListener('scroll', this.scroll, <any>this.eventOptions);
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, <any>this.eventOptions);
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
