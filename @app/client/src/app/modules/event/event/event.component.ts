import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventByIdGQL } from 'src/app/generated/graphql';
import { UtilService } from 'src/app/services/util.service';
import { ENV } from '../../../../environments/environment';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';

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

  initSubscription: SubscriptionLike;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventByIdGQL: EventByIdGQL,
    private utilService: UtilService,
    private eventService: EventService,
    private userService: UserService,
    private appService: AppService
  ) {
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.eventByIdGQL.fetch({
            eventId: this.activatedRoute.snapshot.paramMap.get('eventId'),
            userId: this.userService.user ? this.userService.user.id : 0,
          }).subscribe(
            ({ data }) => {
              this.event = data.event;
              this.appService.modPageMeta(`${this.event.name.trim()} Event Information - ${this.event.venueByVenue.name.split('-')[0].trim()}`, `Check out artist, venue, and ticket information for ${this.event.name.trim()} at ${this.event.venueByVenue.name.split('-')[0].trim()} on ${moment(+this.event.startDate).format('MMMM Do, YYYY')}`);
              this.disqusId = `event/${this.event.id}`;
              // generate add to calendar link
              this.calendarLink = this.utilService.addToCalendar(this.event.name, `${ENV.siteBaseURL}/event/${this.event.id}`, this.event.venueByVenue.address, (new Date(+this.event.startDate)).toISOString().replace(/-|:|\.\d\d\d/g, ''));
              this.watchId = this.event.watchLists.nodes[0] ? this.event.watchLists.nodes[0].id : null;
            }
          );
        }
      }
    );
  }

  ngOnInit() {
  }

  share() {
    this.utilService.share(`${ENV.siteBaseURL}/event/${this.event.id}`);
  }

  scrollTo(option: string): void {
    document.getElementById(option).scrollIntoView({behavior: 'smooth'});
  }

  addWatch() {
    this.eventService.addWatch(this.event.id).then(
      (id) => this.watchId = id
    );
  }

  removeWatch() {
    this.eventService.removeWatch(this.watchId).then(
      () => this.watchId = null
    );
  }

  buyTickets() {
    if (this.event.ticketproviderid) {
      this.eventService.eventbriteCheckout(this.event.ticketproviderid);
    } else {
      window.open(this.event.ticketproviderurl, '_blank');
    }
  }
}
