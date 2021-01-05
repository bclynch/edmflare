import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventByIdGQL } from '../../../generated/graphql';
import { UtilService } from '../../../services/util.service';
import { ENV } from '../../../../environments/environment';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from '../../../services/app.service';
import format from 'date-fns/format';
import { EventbriteService } from '../../eventbrite-checkout/eventbrite.service';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogueComponent } from '../../share-dialogue/share-dialogue/share-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from '../../../services/globalObject.service';

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
    public dialog: MatDialog,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = this.globalObjectService.getWindow();
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.eventByIdGQL.fetch({
            eventId: this.activatedRoute.snapshot.paramMap.get('eventId'),
            userId: this.userService.user ? this.userService.user.id : 0,
          }).subscribe(
            ({ data: { event = {} } = {}}) => {
              this.event = event;
              const { name, id, venueByVenue: { name: venueName, address } = {}, startDate, watchLists } = event;
              const processedStartDate = +startDate;
              const processedVenueName = venueName.split('-')[0].trim();
              this.appService.modPageMeta(`${name.trim()} Event Information - ${processedVenueName}`, `Check out artist, venue, and ticket information for ${name.trim()} at ${processedVenueName} on ${format(processedStartDate, 'MMMM do, yyyy')}`);
              this.disqusId = `event/${id}`;
              // generate add to calendar link
              this.calendarLink = this.utilService.addToCalendar(name, `${ENV.siteBaseURL}/event/${id}`, address, (new Date(processedStartDate)).toISOString().replace(/-|:|\.\d\d\d/g, ''));
              const watchEvent = watchLists.nodes[0];
              this.watchId = watchEvent ? watchEvent.id : null;
            }
          );
        }
      }
    );
  }

  ngOnInit() {
  }

  share() {
    this.dialog.open(ShareDialogueComponent, {
      panelClass: 'sharedialog-panel',
      data: {
        shareUrl: `${ENV.siteBaseURL}/event/${this.event.id}`,
        eventName: this.event.name
      }
    });
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
