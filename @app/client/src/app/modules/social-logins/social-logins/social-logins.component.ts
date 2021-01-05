import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from '../../../services/globalObject.service';

@Component({
  selector: 'app-social-logins',
  templateUrl: './social-logins.component.html',
  styleUrls: ['./social-logins.component.scss']
})

export class SocialLoginsComponent implements OnInit {
  windowRef;

  buttons = [
    {
      label: 'Facebook',
      service: 'facebook',
      icon: faFacebook,
      background: '#3b5998'
    },
    {
      label: 'Google',
      service: 'google',
      icon: faGoogle,
      background: '#de5246'
    },
    {
      label: 'Twitter',
      service: 'twitter',
      icon: faTwitter,
      background: '#00aced'
    }
  ];

  constructor(
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = this.globalObjectService.getWindow();
  }

  ngOnInit() {
  }

  auth(e, service: string) {
    e.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      this.windowRef.location.href = `/auth/${service}`;
    }
  }
}
