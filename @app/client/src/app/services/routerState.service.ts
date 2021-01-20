import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class RouterStateService {
    private history: string[] = [];
    private isBack: boolean;

    constructor(
      private router: Router,
      @Inject(PLATFORM_ID) private platformId: object
    ) {
      this.loadRouting();
    }

    public loadRouting(): void {
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(({ urlAfterRedirects }: NavigationEnd) => {
          this.history = [...this.history, urlAfterRedirects ];
        });

        if (isPlatformBrowser(this.platformId)) {
          window.onpopstate = () => {
            this.isBack = true;
          };
        }
    }

    public getHistory(): string[] {
      return this.history;
    }

    public getDirection(page: string) {
      if (this.isBack) {
        if (page === this.history[this.history.length - 3]) {
          this.history.splice(this.history.length - 2, 2);
          this.isBack = false;
          return 'b';
        }
      }

      return 'f';
    }
}
