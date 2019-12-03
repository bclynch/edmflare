import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SubscriptionLike } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  redirect: string;

  signupForm: FormGroup = this.fb.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ],
    username: ['', Validators.required],
    matchingPassword: this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) // this is for the letters (both uppercase and lowercase) and numbers validation + min 8 chars
        ])
      ],
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    })
  });

  formValidationMessages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
      // need a check for unique eventually
    ],
    'username': [
      { type: 'required', message: 'Username is required' },
    ],
    'confirmPassword': [
      { type: 'areEqual', message: 'Password mismatch' },
      { type: 'required', message: 'Confirm password is required' },
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  paramsSubscription: SubscriptionLike;

  constructor(
    private fb: FormBuilder,
    private userServive: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
    this.appService.modPageMeta('Sign Up', 'Sign up for an EDM Flare account to keep track of upcoming shows in your area');

    // grabbing redirect url and parsing it for base and params
    this.paramsSubscription = this.route.queryParams.subscribe((params) => {
      this.redirect = params.redirect;
    });
  }

  ngOnInit() {
  }

  signup() {
    console.log('this.signupForm', this.signupForm);
    if (this.signupForm.valid) this.userServive.registerUserAccount(this.signupForm.value).then(
      () => {
        if (this.redirect) {
          this.router.navigateByUrl(this.redirect);
        } else {
          this.router.navigateByUrl('/');
        }

        // reload window to update db role
        // setTimeout(() => window.location.reload(), 200);
      },
      () => {}
    );
  }
}

class PasswordValidator {
  // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
  static areEqual(formGroup: FormGroup) {
    let value;
    let valid = true;
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];

        if (value === undefined) {
          value = control.value;
        } else {
          if (value !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }
}
