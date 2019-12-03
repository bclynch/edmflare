import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, SubscriptionLike } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() autocomplete = 'on';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() floatLabel = true;
  @Input() color;
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  myControl = new FormControl();
  options: string[];
  filteredOptions: Observable<any>;

  initSubscription: SubscriptionLike;

  constructor(
    private appService: AppService,
    private locationService: LocationService
  ) {
    this.initSubscription = this.appService.appInited.subscribe((inited) =>  { if (inited) this.init(); });
  }

  ngOnInit() {
  }

  ngOnChanges(change) {
    if (change.value && change.value.currentValue) this.myControl.setValue(change.value.currentValue);
    if (change.value && change.value.currentValue && change.value.currentValue.split('-')[0] === 'reset') this.myControl.setValue('');
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }

  init() {
    this.options = this.appService.locations;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          return this._filter(value);
        })
      );
  }

  private _filter(value: string): string[] {
    let filteredArr = [];
    if (value) {
      const filterValue = value.toLowerCase();

      filteredArr = this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
    filteredArr.unshift('📍 Use my current location');
    return filteredArr;
  }

  resetInput(e) {
    // this is being triggered by the enter button for some reason so checking to see if this prop is there
    // if so it was a real mouse click otherwise we ignore
    if (e.detail) this.myControl.reset();
  }

  selectOption() {
    if (this.myControl.value === '📍 Use my current location') {
      this.myControl.setValue('Finding Location...');
      navigator.geolocation.getCurrentPosition(
        (data) => {
          let closestRegion;
          let closestDistance = 100000;
          // identify which region is closest to user
          this.appService.locationDirectory.forEach((location) => {
            const distance = this.calculateDistance({ lat: location.lat, lon: location.lon }, { lat: data.coords.latitude, lon: data.coords.longitude });
            // if region is closer than current one replace above vars
            if (distance < closestDistance) {
              closestRegion = location.name;
              closestDistance = distance;
            }
          });
          this.myControl.setValue(closestRegion);
          this.selected.emit(this.myControl.value);
        },
        (err) => {
          console.log(err);
          this.myControl.setValue('');
        }
      );
    } else {
      this.selected.emit(this.myControl.value);
    }
  }

  calculateDistance(pair1: { lat: number, lon: number }, pair2: { lat: number, lon: number }): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (pair2.lat - pair1.lat) * Math.PI / 180;  // deg2rad below
    const dLon = (pair2.lon - pair1.lon) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat) / 2 + Math.cos(pair1.lat * Math.PI / 180) * Math.cos(pair2.lat * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }
}
