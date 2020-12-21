import { Component, OnInit } from '@angular/core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';

@Component({
  selector: 'app-social-logins',
  templateUrl: './social-logins.component.html',
  styleUrls: ['./social-logins.component.scss']
})

export class SocialLoginsComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

  auth(e, service: string) {
    e.preventDefault();
    window.location.href = `/auth/${service}`;
  }
}
