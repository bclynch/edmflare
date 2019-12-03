import { Component, OnInit } from '@angular/core';
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons';

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
