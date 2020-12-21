import { Component, OnInit, Input } from '@angular/core';
import { ENV } from '../../../../environments/environment';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { EventService } from '../../../services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogueComponent } from '../../share-dialogue/share-dialogue/share-dialogue.component';

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
    private dialog: MatDialog,
    private eventService: EventService
  ) { }

  ngOnInit() {
  }

  share() {
    this.dialog.open(ShareDialogueComponent, {
      panelClass: 'sharedialog-panel',
      data: {
        shareUrl: `${ENV.siteBaseURL}/event/${this.id}`,
        eventName: this.name
      }
    });
  }

  addWatch() {
    this.eventService.addWatch(this.id).then(
      (id) => {
        this.watchId = id;
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
