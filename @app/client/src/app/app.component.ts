import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AppService } from './services/app.service';
import { GlobalObjectService } from './services/globalObject.service';
import { SwUpdate } from '@angular/service-worker';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  locationRef;

  constructor(
    private appService: AppService,
    private swUpdate: SwUpdate,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
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
}
