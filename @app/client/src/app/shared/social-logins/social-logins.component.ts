import { Component, OnInit } from '@angular/core';
import { faTwitter, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

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
  ]

  constructor() { }

  ngOnInit() {
  }

  auth(e, service: string) {
    e.preventDefault();
    window.location.href = `http://localhost:5000/auth/${service}`;
  }
}
