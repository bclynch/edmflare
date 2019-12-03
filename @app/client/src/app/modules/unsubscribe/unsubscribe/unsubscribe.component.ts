import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UpdateAccountGQL } from 'src/app/generated/graphql';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

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
    private updateAccountGQL: UpdateAccountGQL,
    public snackBar: MatSnackBar,
    private userService: UserService
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
      this.updateAccountGQL.mutate({
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
