import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup = this.fb.group({
    topic: ['', Validators.required],
    email: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])
    ],
    name: ['', Validators.required],
    message: ['', Validators.required],
  });

  formValidationMessages = {
    'topic': [
      { type: 'required', message: 'A topic is required' },
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'name': [
      { type: 'required', message: 'Name is required' },
    ],
    'message': [
      { type: 'required', message: 'A message is required' },
    ],
  };

  topics = ['I need help figuring out how something works', 'I found a bug', 'Other'];

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  submitContact(formDirective: FormGroupDirective) {
    this.emailService.sendContactEmail(this.contactForm.value).subscribe(
      () => {
        this.contactForm.reset();
        formDirective.resetForm();

        this.snackBar.open('Contact message successfully sent', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
