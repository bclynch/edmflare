import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ENV } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

declare let ga: Function;

@Injectable()
export class LocationService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }

  reverseGeocodeCoords(lat: number, lon: number) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&sensor=true&key=${ENV.googleAPIKey}`)
      .pipe(map(
        response => (response)
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
    // return this.mapsAPILoader.load().then(() => {
    //   console.log('Getting coord information...');
    //   const geocoder = new google.maps.Geocoder();
    //   return Observable.create(observer => {
    //     geocoder.geocode( {'location': {lat, lng: lon}}, (results, status) => {
    //       console.log(results);
    //       if (status === google.maps.GeocoderStatus.OK) {
    //         observer.next({ formattedAddress: results[0], country: results.slice(-1)[0] });
    //         observer.complete();
    //       } else {
    //         console.log('Error - ', results, ' & Status - ', status);
    //         observer.next({});
    //         observer.complete();
    //       }
    //     });
    //   });
    // });
  }
}
