import { Component, OnInit, Input } from '@angular/core';
import { ENV } from '../../../../environments/environment';
import { EventService } from '../../../services/event.service';
import { AppService } from '../../../services/app.service';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogueComponent } from '../../share-dialogue/share-dialogue/share-dialogue.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private dialog: MatDialog,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    public appService: AppService
  ) { }

  ngOnInit() {
    this.backgroundImg = `https://edm-flare.s3.amazonaws.com/backgrounds/background${(this.index % 4) + 1}.jpg`;
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
