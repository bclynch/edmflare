import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  // map props
  latlngBounds;
  geoJsonObject: any = null;
  mapStyle;
  fullscreen = false;
  eventMarkers = [];
  mapInited = false;

  initSubscription: SubscriptionLike;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private utilService: UtilService,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.appService.locationDirectory.forEach((location) => {
            const arr = location.citiesByRegion.nodes.slice(0, 3);
            const citiesSample = arr.map((city, i) => (i === arr.length - 1 && i !== 0 ? `and ${city.name}` : city.name));
            const cities = { cities: citiesSample.join(', '), total: location.citiesByRegion.nodes.length - citiesSample.length };
            this.eventMarkers.push({ lat: +location.lat, lon: +location.lon, name: location.name, cities });
          });
          this.generateMap();
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  generateMap() {
    // fitting the map to the markers
    this.mapsAPILoader.load().then(() => {
      this.latlngBounds = new window['google'].maps.LatLngBounds();
      this.eventMarkers.forEach((event) => this.latlngBounds.extend(new window['google'].maps.LatLng(event.lat, event.lon)));

      // grab map style
      this.utilService.getJSON('../../assets/mapStyles/unsaturated.json').subscribe( (data) => {
        this.mapStyle = data;
        this.mapInited = true;
      });
    });
  }

  markerClick(i: number) {
    console.log('nada');
    console.log(this.eventMarkers[i]);
    // // if its starting marker don't need to do anything
    // if (i === 0) return;

    // this.markerLoading = true;
    // // check to see if we have data for this marker. If not fetch
    // this.modJunctureContentArr(i - 1, this.junctureMarkers[i].id).then(() => this.markerLoading = false);
  }
}
