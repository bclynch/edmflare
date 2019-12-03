import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit, OnDestroy {

  expanded: number;

  faqs = [
    {
      title: 'How do you use EDM Flare like an app?',
      content: 'Use EDM Flare on any device. Download from the Google Play store or install with iOS following the firections below. Our web application works just like the iOS or Android apps so no need to install if you don\'t want to!.'
    },
    {
      title: 'How to install with iOS?',
      content: 'In Safari click the share button (center icon on the bottom row). Within the share menu click the "add to homescreen" button and add it to use EDM Flare like any of your other apps!'
    },
    {
      title: 'How to install with Android?',
      content: 'Download from the Google Play Store <a href="https://play.google.com/store/apps/details?id=xyz.appmaker.lushoi&rdid=xyz.appmaker.lushoi" target="_blank" rel="nofollow">here</a>'
    },
    {
      title: 'How can I change my notification policies?',
      content: 'Change your email and push notification settings <a href="https://edmflare.com/settings/notification-preferences">here</a>'
    },
  ];

  paramsSubscription: SubscriptionLike;

  constructor(
    private route: ActivatedRoute
  ) {
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      this.expanded = +params.expanded;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
