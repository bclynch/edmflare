import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogueComponent } from '../shared/share-dialogue/share-dialogue.component';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UtilService {

  scrollDirection: 'up' | 'down' = 'up';
  checkScrollInfinite = false;
  allFetched = false;
  displayExploreNav = false;

  private infiniteActiveSubject: BehaviorSubject<void>;
  public infiniteActive$: Observable<void>;
  public infiniteActive: boolean;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient
  ) {
    this.infiniteActiveSubject = new BehaviorSubject(null);
    this.infiniteActive$ = this.infiniteActiveSubject.asObservable();
    this.infiniteActive = false;
  }

  toggleInfiniteActive(state: boolean) {
    this.infiniteActive = state;
    this.infiniteActiveSubject.next(null);
  }

  share(shareUrl: string) {
    const dialogRef = this.dialog.open(ShareDialogueComponent, {
      panelClass: 'sharedialog-panel',
      data: { shareUrl }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(result);
    // });
  }

  getJSON(path: string) {
    return this.http.get(path).pipe(map(res => (res)));
  }

  addToCalendar(title: string, eventUrl: string, venueAddress: string, date: string) {
    // returns link for a tag href
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title.split(' ').join('+')}&dates=${date}/${date}&details=For+details,+the+event+page+is+here:+${eventUrl}&location=${venueAddress ? venueAddress.split(' ').join('+') : ''}&sf=true&output=xml`;
  }

  calculateDateRange(filter): { min: number, max: number } {
    switch (filter) {
      case null:
      case 'any':
        // if this thing is alive and breaks in 2099 then fuck it why not
        return { min: moment().startOf('day').valueOf(), max: 4102358400000 };
      case 'today':
        return { min: moment().startOf('day').valueOf(), max: moment().endOf('day').valueOf() };
      case 'tomorrow':
        return { min: moment().startOf('day').add(1, 'days').valueOf(), max: moment().endOf('day').add(1, 'days').valueOf() };
      case 'week':
        return { min: moment().startOf('day').valueOf(), max: moment().endOf('week').valueOf() };
      case 'nextWeek':
        return { min: moment().startOf('week').add(1, 'week').valueOf(), max: moment().endOf('week').add(1, 'week').valueOf() };
      case 'month':
        return { min: moment().startOf('day').valueOf(), max: moment().endOf('month').valueOf() };
      case 'nextMonth':
        return { min: this.getMonthDateRange(moment().month() === 11 ? moment().year() + 1 : moment().year(), moment().month() + 1).start.valueOf(), max: this.getMonthDateRange(moment().month() === 11 ? moment().year() + 1 : moment().year(), moment().month() + 1).end.valueOf() };
      // if they select their own range
      default:
        return { min: moment(filter, 'DD-MM-YYYY').startOf('day').valueOf(), max: moment(filter, 'DD-MM-YYYY').endOf('day').valueOf() };
    }
  }

  // creating values for filter by create date for events. This is only for push notifications really
  calculateNewRange(filter): { min: number } {
    switch (filter) {
      case 'everyDay':
        // min is right now minus 24 hours in ms
        return { min: moment().subtract(1, 'days').valueOf() };
      case 'threePerWeek':
        // want to send mon, thurs, and sat
        // so subtracting two days unless its thurs (4) in which case it's three
        return { min: moment().subtract(moment().day() === 4 ? 3 : 2, 'days').valueOf() };
      case 'twoPerWeek':
        // want to send mon, thurs
        // so subtracting three days from thurs (4) and four from mon
        return { min: moment().subtract(moment().day() === 4 ? 3 : 4, 'days').valueOf() };
      case 'onePerWeek':
        // subtract 7 days
        return { min: moment().subtract(7, 'days').valueOf() };
      case 'everyTwoWeeks':
        // subtract 14 days
        return { min: moment().subtract(14, 'days').valueOf() };
      default:
        // if there is no filter for this return everything
        return { min: 10 };
    }
  }

  arrayBufferToBase64( buffer ) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  private getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    const startDate = moment([year, month]);

    // Clone the value before .endOf()
    const endDate = moment(startDate).endOf('month');

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate, end: endDate };
  }
}
