import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss']
})
export class UserSetupComponent implements OnInit {

  constructor(
    private appService: AppService
  ) {
    this.appService.modPageMeta('User Setup', 'Get a new account all setup and ready for a full experience');
  }

  ngOnInit() {
  }

  completeSetup() {
    // update user to flag them as have completed setup
  }
}
