import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit {

  constructor(
    public appService: AppService
  ) {
    this.appService.modPageMeta('Notification Preference Settings', 'Modify notification settings for your EDM Flare account');
  }

  ngOnInit() {
  }

}
