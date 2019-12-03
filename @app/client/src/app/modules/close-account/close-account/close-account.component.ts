import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.scss']
})
export class CloseAccountComponent implements OnInit {

  constructor(
    private appService: AppService
  ) {
    this.appService.modPageMeta('Close Account', 'Options for closing your EDM Flare account');
  }

  ngOnInit() {
  }

  closeAccount() {
    alert('closing stuff');
    // should pop a modal where they add their username a la pomb
  }
}
