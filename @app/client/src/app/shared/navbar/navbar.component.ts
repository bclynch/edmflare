import { Component, Input } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() collapsibleNav: boolean;
  @Input() hasBack: boolean;

  signedIn = false;
  abc = 'assets/images/edm_flare.png';

  constructor(
    public utilService: UtilService,
    private userService: UserService,
    private location: Location,
    private router: Router
  ) {
    this.userService.signedIn.subscribe((signedIn) => this.signedIn = signedIn);
  }

  logout() {
    console.log('LOGOUT USER');
    // this.userService.logoutUser().subscribe((x) => console.log('x', x));
  }
}
