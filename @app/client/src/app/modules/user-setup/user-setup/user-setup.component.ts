import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { UpdateUserGQL } from 'src/app/generated/graphql';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss']
})
export class UserSetupComponent implements OnInit {

  constructor(
    private appService: AppService,
    private router: Router,
    private updateUserGQL: UpdateUserGQL,
    private userService: UserService
  ) {
    this.appService.modPageMeta('User Setup', 'Get a new account all setup and ready for a full experience');
  }

  ngOnInit() {
  }

  completeSetup() {
    // update user object to have isSetup = true
    this.updateUserGQL.mutate({
      userId: this.userService.user.id,
      isSetup: true
    })
    .subscribe(
      () => {
        this.userService.user.isSetup = true;
        this.router.navigateByUrl('/');
      },
      err => console.log(err)
    );
  }
}
