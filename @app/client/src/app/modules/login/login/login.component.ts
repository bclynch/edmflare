import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  redirect: string;
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  paramsSubscription: SubscriptionLike;

  constructor(
    private fb: FormBuilder,
    private userServive: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
    this.appService.modPageMeta('Login', 'Login to your EDM Flare account');

    // grabbing redirect url and parsing it for base and params
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      this.redirect = params.redirect;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  login() {
    if (this.loginForm.valid) this.userServive.loginUser(this.loginForm.value).then(
      () => {
        if (this.redirect) {
          this.router.navigateByUrl(this.redirect);
        } else {
          this.router.navigateByUrl('/');
        }

        // // reload window to update db role
        // setTimeout(() => window.location.reload(), 200);
      },
      () => {}
    );
  }

  github(e) {
    e.preventDefault();
    window.location.href = 'http://localhost:5000/auth/github';
  }
}
