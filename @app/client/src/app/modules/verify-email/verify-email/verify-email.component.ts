import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VerifyEmailGQL } from 'src/app/generated/graphql';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  paramsSubscription: SubscriptionLike;
  token: string;
  id: number;
  isVerified = false;

  constructor(
    private verifyEmailGQL: VerifyEmailGQL,
    private route: ActivatedRoute,
    public appService: AppService
  ) {
    // grabbing token off url
    this.token = this.route.snapshot.queryParams.token;
    this.id = +this.route.snapshot.queryParams.id;
  }

  ngOnInit() {
    this.verifyEmailGQL.mutate({ id: this.id, token: this.token }).subscribe(
      ({ data }) => {
        if (data.verifyEmail.success) {
          this.isVerified = true;
        }
      }, err => {
        console.log('err', err);
      }
    );
  }

}
