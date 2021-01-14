import { Component, OnInit, Input } from '@angular/core';
import { ENV } from '../../../../environments/environment';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { EventService } from '../../../services/event.service';
import { AppService } from '../../../services/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareService } from '../../../services/share.service';

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
    private eventService: EventService,
    private snackBar: MatSnackBar,
    public appService: AppService,
    private shareService: ShareService
  ) { }

  ngOnInit() {
  }

  share() {
    const data = {
      shareUrl: `${ENV.siteBaseURL}/event/${this.id}`,
      eventName: this.name
    };
    this.shareService.share(data);
  }

  addWatch() {
    this.eventService.addWatch(this.id, this.name).then(
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
}
