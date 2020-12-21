import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UpdateUserGQL } from 'src/app/generated/graphql';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit, OnDestroy {

  paramsSubscription: SubscriptionLike;
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private updateUserGQL: UpdateUserGQL,
    public snackBar: MatSnackBar,
    private userService: UserService,
    public appService: AppService
  ) {
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      this.userId = +params.accountId;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  unsubscribe() {
    if (this.userId) {
      this.updateUserGQL.mutate({
        userId: this.userId,
        emailNotification: false
      })
      .subscribe(
        () => {
          this.snackBar.open('You have been unsubscribed from new show email notifications', 'Close', {
            duration: 5000,
          });
          this.userService.user.emailNotification = false;
        },
        err => console.log(err)
      );
    } else {
      this.snackBar.open('No account provided to unsubscribe. Log in and check your notification preferences to change', 'Close', {
        duration: 5000,
      });
    }
  }
}
