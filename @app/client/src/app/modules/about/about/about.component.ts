import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    public appService: AppService
  ) { }

  ngOnInit() {
  }

}
