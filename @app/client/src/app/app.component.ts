import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AppService } from './services/app.service';
import { GlobalObjectService } from './services/globalObject.service';
import { DeviceService, DeviceType } from './services/device.service';
import { RouterStateService } from './services/routerState.service';
import { SwUpdate } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';
import { routerTransition } from './router-animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  locationRef;

  currentState = 0;
  lastPage: string;

  constructor(
    private appService: AppService,
    private swUpdate: SwUpdate,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object,
    private routerStateService: RouterStateService,
    private deviceService: DeviceService
  ) {
    this.appService.appInit();
    this.locationRef = this.globalObjectService.getLocation();
  }

  ngOnInit() {
    // detect service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          if (isPlatformBrowser(this.platformId)) {
            this.locationRef.reload();
          }
        }
      });
    }
  }

  getState(outlet: RouterOutlet) {
    // @ts-ignore
    if (outlet.activated) {
      // @ts-ignore
      const state = outlet.activatedRoute.snapshot._routerState.url;

      // we don't want transitions on desktop web -- its weird...
      const isDesktopWeb = this.deviceService.device === DeviceType.WEB && isPlatformBrowser(this.platformId) && document.documentElement.clientWidth >= 768;
      if (this.lastPage !== state && this.lastPage && !isDesktopWeb) {
        const dir = this.routerStateService.getDirection(state);

        // no transition if straight to home
        const isDirectToHome = state === '/' && dir === 'f';
        if (!isDirectToHome) {
          if (dir === 'f') {
            this.currentState++;
          } else {
            this.currentState--;
          }
        }
      }
      this.lastPage = state;
    }

      return this.currentState;
  }
}
