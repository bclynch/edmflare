import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-venue-map',
  templateUrl: './venue-map.component.html',
  styleUrls: ['./venue-map.component.scss']
})
export class VenueMapComponent implements OnInit {
  @Input() lat: number;
  @Input() lon: number;
  @Input() style = 'unsaturated';
  @Input() eventName: string;
  @Input() venueName: string;
  @Input() address: string;

  inited = false;

  // map props
  coords: { lat: number; lon: number; } = { lat: null, lon: null };
  zoomLevel = 16;
  latlngBounds;
  mapStyle;

  navOptions = [];

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.coords.lat = this.lat;
    this.coords.lon = this.lon;

    this.navOptions = [
      {
        icon: 'directions_car',
        type: 'driving',
        link: `https://maps.google.com?saddr=Current+Location&dirflg=d&daddr=${this.coords.lat},${this.coords.lon}&mode=driving`
      },
      {
        icon: 'directions_walk',
        type: 'walking',
        link: `https://maps.google.com?saddr=Current+Location&dirflg=w&daddr=${this.coords.lat},${this.coords.lon}`
      },
      {
        icon: 'directions_transit',
        type: 'transit',
        link: `https://maps.google.com?saddr=Current+Location&dirflg=r&daddr=${this.coords.lat},${this.coords.lon}&mode=transit`
      },
      {
        icon: 'directions_bike',
        type: 'bicycling',
        link: `https://maps.google.com?saddr=Current+Location&dirflg=b&daddr=${this.coords.lat},${this.coords.lon}&mode=bicycling`
      }
    ];
    // grab map style
    this.utilService.getJSON(`../../../assets/mapStyles/${this.style}.json`).subscribe( (data) => {
      this.mapStyle = data;
      this.inited = true;
    });
  }

}
