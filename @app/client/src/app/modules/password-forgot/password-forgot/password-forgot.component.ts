import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ForgotPasswordGQL } from 'src/app/generated/graphql';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss']
})
export class PasswordForgotComponent implements OnInit {

  emailSent = false;

  forgotForm: FormGroup = this.fb.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ]
  });

  formValidationMessages = {
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private forgotPasswordGQL: ForgotPasswordGQL,
    public appService: AppService
  ) { }

  ngOnInit() {
  }

  sendReset() {
    if (this.forgotForm.valid) {
      this.forgotPasswordGQL.mutate({ email: this.forgotForm.value.email }).subscribe(
        () => {
          this.emailSent = true;
        }
      );
    }
  }
}
