import { Component, OnInit } from '@angular/core';
// import { ResetPasswordGQL } from 'src/app/generated/graphql';
import { EmailService } from 'src/app/services/email.service';
import { FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  resetForm: FormGroup = this.fb.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
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
    // private resetPasswordGQL: ResetPasswordGQL,
    private emailService: EmailService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  sendReset(formDirective: FormGroupDirective) {
    // this.resetPasswordGQL.mutate({ email: this.resetForm.value.email })
    //   .subscribe(
    //     (result) => {
    //       this.emailService.sendResetEmail(this.resetForm.value.email, result.data.resetPassword.string).subscribe(
    //         (data: any) => {
    //           console.log(data);
    //           if (data.result === 'Forgot email sent') {
    //             this.resetForm.reset();
    //             formDirective.resetForm();
    //             this.snackBar.open('Your password reset email has been sent. Please check your inbox for the new password. It might take a minute or two to send.', 'Close', {
    //               duration: 10000,
    //             });
    //           }
    //         }
    //       );
    //     },
    //     err => {
    //       switch (err.message) {
    //         case 'GraphQL error: permission denied for function reset_password':
    //           this.snackBar.open('Cannot reset password while user is logged in', 'Close', {
    //             duration: 5000,
    //           });
    //           break;
    //         case 'GraphQL error: column "user does not exist" does not exist':
    //           this.snackBar.open('That email doesn\'t exist. Check what you entered and try again', 'Close', {
    //             duration: 5000,
    //           });
    //           break;
    //         default:
    //           this.snackBar.open('Something went wrong. Check your email address and try again', 'Close', {
    //             duration: 5000,
    //           });
    //       }
    //     }
    //   );
  }
}
