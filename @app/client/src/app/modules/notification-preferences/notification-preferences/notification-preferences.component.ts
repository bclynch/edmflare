import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { UpdateAccountGQL, Frequency, WatchedLocationByAccountGQL, DeleteWatchedByIdGQL, CreateWatchedToAccountGQL, DeletePushSubscriptionByIdGQL } from 'src/app/generated/graphql';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-preferences',
  templateUrl: './notification-preferences.component.html',
  styleUrls: ['./notification-preferences.component.scss']
})
export class NotificationPreferencesComponent implements OnInit {

  locationValue: string;
  locations: { id: number, label: string, locationId: number | string }[] = [];

  frequency: Frequency;
  frequencies = [
    { label: 'Every day', value: 'EVERY_DAY' },
    { label: 'Three times a week', value: 'THREE_TIMES_A_WEEK' },
    { label: 'Two times a week', value: 'TWO_TIMES_A_WEEK' },
    { label: 'Once a week', value: 'ONCE_A_WEEK' },
    { label: 'Once every two weeks', value: 'ONCE_EVERY_TWO_WEEKS' },
    { label: 'Never', value: 'NEVER' }
  ];
  initSubscription: SubscriptionLike;

  pushNotification;
  emailNotification;

  constructor(
    public appService: AppService,
    private updateAccountGQL: UpdateAccountGQL,
    private userService: UserService,
    private watchedLocationByAccountGQL: WatchedLocationByAccountGQL,
    private snackBar: MatSnackBar,
    private deleteWatchedByIdGQL: DeleteWatchedByIdGQL,
    private createWatchedToAccountGQL: CreateWatchedToAccountGQL,
    private deletePushSubscriptionByIdGQL: DeletePushSubscriptionByIdGQL
  ) {
    this.appService.modPageMeta('Notification Preference Settings', 'Modify notification settings for your EDM Flare account');

    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.frequency = this.userService.user.notificationFrequency;
          this.pushNotification = this.userService.user.pushNotification;
          this.emailNotification = this.userService.user.emailNotification;

          this.watchedLocationByAccountGQL.fetch({
            userId: this.userService.user.id
          }).subscribe(
            ({ data }) => {
              console.log(data.watchedToAccounts.nodes);
              // this.locations = data.allWatchedToAccounts.nodes;
              this.locations = data.watchedToAccounts.nodes.map(({ region, id, city }) => {
                return region ? { id, label: region, locationId: region } : { id, label: city.name, locationId: city.id };
              });
            }
          );
        }
      }
    );
  }

  ngOnInit() {
  }

  changeFrequency() {
    console.log(this.frequency);
    this.updateAccountGQL.mutate({
      userId: this.userService.user.id,
      notificationFrequency: this.frequency
    })
    .subscribe(
      (result) => {
        console.log(result);
        if (this.frequency !== 'NEVER' && !this.locations.length) {
          this.snackBar.open('Select at least one location to get email updates!', 'Close', {
            duration: 5000,
          });
        }
      },
      err => console.log(err)
    );
  }

  selectLocation(location: string) {
    const locationId = this.appService.locationsObj[location];

    // make sure its not a repeat. If so break fn
    for (const x of this.locations) {
      if (x.locationId === locationId) {
        this.locationValue = `reset-${Math.random()}`;
        return;
      }
    }

    if (this.locations.length === 5) {
      this.snackBar.open('You can only select up to five locations at a time to be notified for. Remove one to add more', 'Close', {
        duration: 5000,
      });
    } else {
      console.log(location);
      // save to account
      this.createWatchedToAccountGQL.mutate({
        userId: this.userService.user.id,
        region: typeof locationId === 'string' ? locationId : null,
        cityId: typeof locationId === 'string' ? null : locationId
      })
        .subscribe(
          ({ data }) => {
            console.log(data.createWatchedToAccount.watchedToAccount);
            // add to local arr
            this.locations.push({ id: data.createWatchedToAccount.watchedToAccount.id, label: location, locationId });
            // onchange only fires if the binding changes so putting rand number
            this.locationValue = `reset-${Math.random()}`;
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  removeLocation(e, id: number, index: number) {
    e.preventDefault();

    this.deleteWatchedByIdGQL.mutate({ id })
      .subscribe(
        () => this.locations.splice(index, 1),
        err => console.log(err)
      );
  }

  togglePushNotifications() {
    console.log(this.pushNotification);
    // if it's true we make sure the user selects it and creates subscription before adding updated pushnotification prop to db
    if (this.pushNotification) {
      this.appService.subscribeToPushNotifications().then(
        () => {
          this.updateAccountGQL.mutate({
            userId: this.userService.user.id,
            pushNotification: this.pushNotification
          })
          .subscribe(
            (result) => {
              console.log(result);
            },
            err => console.log(err)
          );
        }
      );
    } else {
      // delete the subscription in the db
      this.deletePushSubscriptionByIdGQL.mutate({ id: this.userService.user.pushSubscriptionsByAccountId.nodes[0].id })
      .subscribe(
        () => {
          this.updateAccountGQL.mutate({
            userId: this.userService.user.id,
            pushNotification: this.pushNotification
          })
          .subscribe(
            (result) => {
              console.log(result);
            },
            err => console.log(err)
          );
        },
        err => console.log(err)
      );
    }
  }

  toggleEmailNotifications() {
    console.log(this.emailNotification);
    this.updateAccountGQL.mutate({
      userId: this.userService.user.id,
      emailNotification: this.emailNotification
    })
    .subscribe(
      (result) => {
        console.log(result);
      },
      err => console.log(err)
    );
  }
}
