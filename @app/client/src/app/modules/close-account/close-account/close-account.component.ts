import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestAccountDeletionGQL, ConfirmAccountDeletionGQL } from 'src/app/generated/graphql';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-close-account',
  templateUrl: './close-account.component.html',
  styleUrls: ['./close-account.component.scss']
})
export class CloseAccountComponent implements OnInit {

  token: string;

  confirmationSent = false;
  isDeleted = false;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private requestAccountDeletionGQL: RequestAccountDeletionGQL,
    private confirmAccountDeletionGQL: ConfirmAccountDeletionGQL,
    public snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {
    this.appService.modPageMeta('Close Account', 'Options for closing your EDM Flare account');
    this.token = this.route.snapshot.queryParams.token;
  }

  ngOnInit() {
  }

  requestDeletion() {
    this.requestAccountDeletionGQL.mutate().subscribe(
      ({ data }) => {
        if (data.requestAccountDeletion.success) this.confirmationSent = true;
      }
    )
  }

  confirmDeletion() {
    this.confirmAccountDeletionGQL.mutate({ token: this.token }).subscribe(
      ({ data }) =>{
        if (data.confirmAccountDeletion.success) this.isDeleted = true;
        const snackBarRef = this.snackBar.open('Your account has been successfully deleted', 'Close', {
          duration: 3000,
        });
        // send them back to homepage
        snackBarRef.afterDismissed().subscribe(() => {
          this.userService.user = null;
          this.userService.signedInSubject.next(false);
          this.router.navigateByUrl('/');
        })
      }
    )
  }
}
