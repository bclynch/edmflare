import { Component, OnInit } from '@angular/core';
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple';
import { faGooglePlay } from '@fortawesome/free-brands-svg-icons/faGooglePlay';

@Component({
  selector: 'app-get-app',
  templateUrl: './get-app.component.html',
  styleUrls: ['./get-app.component.scss']
})
export class GetAppComponent implements OnInit {
  faApple = faApple;
  faGooglePlay = faGooglePlay;

  constructor() { }

  ngOnInit() {
  }

}
