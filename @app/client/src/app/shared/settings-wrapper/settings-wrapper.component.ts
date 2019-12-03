import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-settings-wrapper',
  templateUrl: './settings-wrapper.component.html',
  styleUrls: ['./settings-wrapper.component.scss']
})
export class SettingsWrapperComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  navOptions = [
    {
      label: 'User Profile',
      path: '/settings/user-profile'
    },
    {
      label: 'Password',
      path: '/settings/password'
    },
    {
      label: 'Notification Preferences',
      path: '/settings/notification-preferences'
    },
    {
      label: 'Close Account',
      path: '/settings/close-account'
    }
  ];

  constructor(
    private appService: AppService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
