import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { UserByUsernameGQL } from 'src/app/generated/graphql';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  initSubscription: SubscriptionLike;
  user;

  constructor(
    private appService: AppService,
    private userByUsernameGQL: UserByUsernameGQL,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    const username = this.activatedRoute.snapshot.paramMap.get('username');
    this.appService.modPageMeta(`${username} User Information`, `Check out followed artists and venues as well as watched events for user ${username}`);
    this.initSubscription = this.appService.appInited.subscribe(
      (inited) =>  {
        if (inited) {
          this.userByUsernameGQL.fetch({
            username,
            userId: this.userService.user ? this.userService.user.id : 0,
          }).subscribe(
            ({ data }) => {
              this.user = data.userByUsername;
              console.log(this.user);
              if (!this.user) this.router.navigateByUrl('/');
            }
          );
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.initSubscription.unsubscribe();
  }
}
