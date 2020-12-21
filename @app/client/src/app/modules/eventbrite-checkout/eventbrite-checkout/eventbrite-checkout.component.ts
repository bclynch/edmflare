import { Component, OnInit, Inject } from '@angular/core';
import { CONTAINER_DATA } from './eventbrite-overlay.token';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-eventbrite-checkout',
  templateUrl: './eventbrite-checkout.component.html',
  styleUrls: ['./eventbrite-checkout.component.scss']
})
export class EventbriteCheckoutComponent implements OnInit {

  eventId: number;
  // move these to env vars
  domain = 'edmflare.com';
  affiliate = 'ebdimtedmtrain';
  eventbriteUrl: SafeResourceUrl;

  constructor(
    @Inject(CONTAINER_DATA) public componentData: any,
    private sanitizer: DomSanitizer
  ) {
    this.eventId = componentData.eventId;
    this.eventbriteUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.eventbrite.com/checkout-external?eid=${this.eventId}&amp;parent=https%3A%2F%2F${this.domain}%2F&amp;modal=1&amp;aff=${this.affiliate}`);
  }

  ngOnInit() {
  }
}
