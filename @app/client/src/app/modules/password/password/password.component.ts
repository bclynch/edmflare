import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormGroup, Validators, FormControl, FormBuilder, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { UpdatePasswordGQL } from 'src/app/generated/graphql';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

  changeForm: FormGroup = this.fb.group({
    currentPassword: [
      '',
      Validators.compose([
        Validators.required
      ])
    ],
    matchingPassword: this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) // this is for the letters (both uppercase and lowercase) and numbers validation
        ])
      ],
      confirmPassword: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    })
  });

  formValidationMessages = {
    'currentPassword': [
      { type: 'required', message: 'Current Password is required' }
    ],
    'confirmPassword': [
      { type: 'areEqual', message: 'Password mismatch' },
      { type: 'required', message: 'Confirm password is required' },
    ],
    'password': [
      { type: 'required', message: 'New password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ]
  };

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    // private updatePasswordGQL: UpdatePasswordGQL,
    private userService: UserService,
  ) {
    this.appService.modPageMeta('Password Settings', 'Modify password settings for your EDM Flare account');
  }

  ngOnInit() {
  }

  changePassword(formDirective: FormGroupDirective) {
    // this.updatePasswordGQL.mutate({ userId: this.userService.user.id, password: this.changeForm.value.currentPassword, newPassword: this.changeForm.value.matchingPassword.password })
    //   .subscribe(
    //     (result) => {
    //       if (result.data.updatePassword.boolean) {
    //         this.snackBar.open('Password changed', 'Close', {
    //           duration: 3000,
    //         });
    //         formDirective.resetForm();
    //         this.changeForm.reset();
    //       } else {
    //         this.snackBar.open('Something went wrong. Make sure you have the correct current password', 'Close', {
    //           duration: 3000,
    //         });
    //       }
    //     }
    //   );
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
