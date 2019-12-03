import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(
    private appService: AppService
  ) {
    this.appService.modPageMeta('Page Not Found', 'The url does not exist');
  }

  ngOnInit() {
  }

}
