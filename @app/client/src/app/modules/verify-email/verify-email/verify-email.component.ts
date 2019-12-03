import { Component, OnInit } from '@angular/core';
import { VerifyUserEmailGQL } from 'src/app/generated/graphql';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.sass']
})
export class VerifyEmailComponent implements OnInit {

  paramsSubscription: SubscriptionLike;
  token: string;
  isVerified = false;

  constructor(
    private verifyUserEmailGQL: VerifyUserEmailGQL,
    private route: ActivatedRoute,
  ) {
    // grabbing token off url
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit() {
    this.verifyUserEmailGQL.mutate({ token: this.token }).subscribe(
      ({ data }) => {
        if (data.verifyUserEmail.userEmail.isVerified) {
          this.isVerified = true;
        }
      }, err => {
        console.log('err', err);
      }
    );
  }

}
