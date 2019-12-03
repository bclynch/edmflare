import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit, OnDestroy {

  locations;
  initSubscription: SubscriptionLike;

  constructor(
    private appService: AppService
  ) {
    this.appService.modPageMeta('Locations', 'Listing of locations for edm shows');
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.locations = this.appService.locationDirectory;
          console.log(this.locations);
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }
}
