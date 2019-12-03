import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private appService: AppService,
    public userService: UserService
  ) {
    this.appService.modPageMeta('User Profile Settings', 'Modify user settings for your EDM Flare account');
  }

  ngOnInit() {
  }

}
