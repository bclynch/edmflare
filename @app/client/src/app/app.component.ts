import { Component, OnInit } from '@angular/core';
import { AppService } from './services/app.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private appService: AppService,
    private swUpdate: SwUpdate
  ) {
    this.appService.appInit();
  }

  ngOnInit() {
    // detect service worker updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
  }
}
