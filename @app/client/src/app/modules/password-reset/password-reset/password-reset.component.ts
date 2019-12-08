import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordGQL } from 'src/app/generated/graphql';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  isReset = false;

  token: string;
  userId: number;

  resetForm: FormGroup = this.fb.group({
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) // this is for the letters (both uppercase and lowercase) and numbers validation + min 8 chars
      ])
    ]
  });

  formValidationMessages = {
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private resetPasswordGQL: ResetPasswordGQL,
    private route: ActivatedRoute
  ) {
    this.token = this.route.snapshot.queryParams.token;
    this.userId = +this.route.snapshot.queryParams['user_id'];
  }

  ngOnInit() {
  }

  sendReset() {
    if (this.resetForm.valid) {
      this.resetPasswordGQL.mutate({ userId: this.userId, token: this.token, password: this.resetForm.value.password }).subscribe(
        ({ data }) => {
            if (data.resetPassword.success) this.isReset = true;
        },
        (err) => {
          console.log('ERR: ', err);
        }
      );
    }
  }
}
