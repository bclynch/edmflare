import { Component, Input } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { UserService } from '../../../services/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() collapsibleNav: boolean;
  @Input() hasBack: boolean;

  signedIn = false;

  constructor(
    public utilService: UtilService,
    private userService: UserService,
    public location: Location,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userService.signedIn.subscribe((signedIn) => {
      this.signedIn = signedIn;
    });
  }

  logout() {
    this.userService.logoutUser().then((message) => {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
      });
    });
  }
}
