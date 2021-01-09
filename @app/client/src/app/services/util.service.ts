import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from './globalObject.service';

@Injectable()
export class UtilService {
  windowRef;
  scrollDirection: 'up' | 'down' = 'up';
  checkScrollInfinite = false;
  allFetched = false;
  displayExploreNav = false;

  private infiniteActiveSubject: BehaviorSubject<void>;
  public infiniteActive$: Observable<void>;
  public infiniteActive: boolean;

  constructor(
    private http: HttpClient,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.infiniteActiveSubject = new BehaviorSubject(null);
    this.infiniteActive$ = this.infiniteActiveSubject.asObservable();
    this.infiniteActive = false;
    this.windowRef = this.globalObjectService.getWindow();
  }

  toggleInfiniteActive(state: boolean) {
    this.infiniteActive = state;
    this.infiniteActiveSubject.next(null);
  }

  getJSON(path: string) {
    return this.http.get(path).pipe(map(res => (res)));
  }

  addToCalendar(title: string, eventUrl: string, venueAddress: string, date: string) {
    // returns link for a tag href
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title.split(' ').join('+')}&dates=${date}/${date}&details=For+details,+the+event+page+is+here:+${eventUrl}&location=${venueAddress ? venueAddress.split(' ').join('+') : ''}&sf=true&output=xml`;
  }

  arrayBufferToBase64(buffer) {
    if (isPlatformBrowser(this.platformId)) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[ i ]);
      }
      return this.windowRef.btoa(binary);
    }
    return '';
  }
}
