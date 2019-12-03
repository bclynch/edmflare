import { Component, OnInit, Input } from '@angular/core';
import { ENV } from '../../../environments/environment';
import { EventService } from 'src/app/services/event.service';
import { UtilService } from 'src/app/services/util.service';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event-card-alt',
  templateUrl: './event-card-alt.component.html',
  styleUrls: ['./event-card-alt.component.scss']
})
export class EventCardAltComponent implements OnInit {
  @Input() name: string;
  @Input() location: string;
  @Input() date: number;
  @Input() id: string;
  @Input() externalUrl: string;
  @Input() image: string;
  @Input() ticketProviderId: number;
  @Input() watchId: number;
  @Input() index: number;

  backgroundImg;
  faExternalLinkAlt = faExternalLinkAlt;

  constructor(
    private utilService: UtilService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.backgroundImg = `assets/backgrounds/background${(this.index % 4) + 1}.jpg`;
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
