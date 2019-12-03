import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ENV } from '../../../environments/environment';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() name: string;
  @Input() location: string;
  @Input() date: number;
  @Input() id: string;
  @Input() externalUrl: string;
  @Input() image: string;
  @Input() ticketProviderId: number;
  @Input() size: 'half' | 'full' = 'full';
  @Input() watchId: number;
  @Input() new = false;

  faExternalLinkAlt = faExternalLinkAlt;

  constructor(
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  share() {
    this.utilService.share(`${ENV.siteBaseURL}/event/${this.id}`);
  }

  addWatch() {
    this.eventService.addWatch(this.id).then(
      (id) => this.watchId = id
    );
  }

  removeWatch() {
    this.eventService.removeWatch(this.watchId).then(
      () => this.watchId = null
    );
  }
}
