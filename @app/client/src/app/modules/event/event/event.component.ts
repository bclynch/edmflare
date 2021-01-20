import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventByIdGQL } from '../../../generated/graphql';
import { UtilService } from '../../../services/util.service';
import { ENV } from '../../../../environments/environment';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import format from 'date-fns/format';
import { EventbriteService } from '../../eventbrite-checkout/eventbrite.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from '../../../services/globalObject.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { ShareService } from '../../../services/share.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  event;
  disqusId: string;
  calendarLink: string;
  watchId;
  loadComments = false;
  windowRef;

  initSubscription: SubscriptionLike;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventByIdGQL: EventByIdGQL,
    private utilService: UtilService,
    private eventService: EventService,
    private eventbriteService: EventbriteService,
    private userService: UserService,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object,
    private transferState: TransferState,
    private shareService: ShareService,
    private router: Router
  ) {
    this.windowRef = this.globalObjectService.getWindow();
    const eventId = this.activatedRoute.snapshot.paramMap.get('eventId');
    const title = this.activatedRoute.snapshot.paramMap.get('title');
    const EVENT_KEY = makeStateKey(`event-${eventId}`);

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          if (this.transferState.hasKey(EVENT_KEY)) {
            const eventData = this.transferState.get(EVENT_KEY, null);
            this.transferState.remove(EVENT_KEY);
            this.event = eventData;
            this.redirect(title, eventId);
            this.finishProcessing(eventData);
          } else {
            this.eventByIdGQL.fetch({
              eventId,
              userId: this.userService.user ? this.userService.user.id : 0,
            }).subscribe(
              ({ data: { event = {} } = {}}) => {
                this.event = event;
                this.redirect(title, eventId);
                if (isPlatformServer(this.platformId)) {
                  this.transferState.set(EVENT_KEY, event);
                }
                this.finishProcessing(event);
              }
            );
          }
        }
      }
    );
  }

  ngOnInit() {
  }

  redirect(title, eventId) {
    if (title === '') {
      const sluggified = this.event.name.replace(/\s+/g, '-');
      this.router.navigate([`/event/${eventId}/${sluggified}`]);
    }
  }

  finishProcessing(event) {
    const { name, id, venueByVenue: { name: venueName = '', address = '' } = {}, startDate, watchLists } = event;
    const processedStartDate = +startDate;
    const processedVenueName = venueName.split('-')[0].trim();
    this.appService.modPageMeta(`${name.trim()} Event Information - ${processedVenueName}`, `Check out artist, venue, and ticket information for ${name.trim()} at ${processedVenueName} on ${format(processedStartDate, 'MMMM do, yyyy')}`);
    // generate add to calendar link
    this.calendarLink = this.utilService.addToCalendar(name, `${ENV.siteBaseURL}/event/${id}`, address, (new Date(processedStartDate)).toISOString().replace(/-|:|\.\d\d\d/g, ''));
    const watchEvent = watchLists.nodes[0];
    this.watchId = watchEvent ? watchEvent.id : null;
  }

  share() {
    const data = {
      shareUrl: `${ENV.siteBaseURL}/event/${this.event.id}`,
      eventName: this.event.name
    };
    this.shareService.share(data);
  }

  scrollTo(option: string): void {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  addWatch() {
    this.eventService.addWatch(this.event.id, this.event.name).then(
      ({ data: id, message }) => {
        if (id) {
          this.watchId = id;
        }
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
      }
    );
  }

  removeWatch() {
    this.eventService.removeWatch(this.watchId).then(
      () => {
        this.watchId = null;
      }
    );
  }

  buyTickets() {
    if (this.event.ticketproviderid) {
      this.eventbriteService.eventbriteCheckout(this.event.ticketproviderid);
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.windowRef.open(this.event.ticketproviderurl, '_blank');
      }
    }
  }
}
