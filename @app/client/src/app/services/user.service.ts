import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CookieService } from 'ngx-cookie-service';
import { CurrentUserGQL, CreateFollowListGQL, RemoveFollowlistGQL, LoginUserGQL, RegisterUserGQL } from '../generated/graphql';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from './email.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ENV } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
  public signedIn: Observable<boolean>;
  private signedInSubject: BehaviorSubject<boolean>;
  user = null;

  constructor(
    private apollo: Apollo,
    private cookieService: CookieService,
    private loginUserGQL: LoginUserGQL,
    private registerUserGQL: RegisterUserGQL,
    private currentUserGQL: CurrentUserGQL,
    private createFollowListGQL: CreateFollowListGQL,
    private removeFollowlistGQL: RemoveFollowlistGQL,
    private snackBar: MatSnackBar,
    private emailService: EmailService,
    private http: HttpClient
  ) {
    this.signedInSubject = new BehaviorSubject<boolean>(false);
    this.signedIn = this.signedInSubject;
  }

  fetchUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.currentUserGQL.fetch().subscribe(
        ({ data }) => {
          console.log(data);
          if (data && data.currentUser) {
            this.user = data.currentUser;
            this.signedInSubject.next(true);
          }
          resolve();
        },
        (err) => resolve()
      );
    });
  }

  loginUser({ username, password }) {
    return new Promise<string>((resolve, reject) => {
      this.loginUserGQL.mutate({ username, password }).subscribe(({ data }) => {
        console.log('got data', data);
        // if (authData.authenticateUserAccount.jwtToken) {
        //   this.signedInSubject.next(true);
        //   // reset apollo cache and refetch queries
        //   this.apollo.getClient().resetStore();
        //   resolve(authData.authenticateUserAccount.jwtToken);
        //  }
        resolve();
      }, (error) => {
        console.log('there was an error sending the query', error);
        alert('The email or password is incorrect. Please check your account information and login again');
        reject();
      });
    });
  }

  logoutUser() {
    // console.log('${ENV.apiBaseURL}/logout', `${ENV.apiBaseURL}/logout`);
    // const headerDict = {
    //   'Access-Control-Allow-Origin': 'http://localhost:4200'
    // };
    // return this.http.get(`${ENV.apiBaseURL}/logout`, {
    //   headers: new HttpHeaders(headerDict)
    // })
    //   .pipe(map(response => response))
    //   .pipe(catchError((error: HttpErrorResponse) => throwError(error.message || 'server error.')
    // ));
    // this.signedInSubject.next(false);
    // // reset apollo cache and refetch queries
    // this.apollo.getClient().resetStore();
    // // reload window to update db role
    // window.location.reload();
  }

  registerUserAccount({ username, email, matchingPassword }) {
    return new Promise<string>((resolve, reject) => {
      console.log({ username, email, matchingPassword });
      this.registerUserGQL.mutate({ username, email, password: matchingPassword.password }).subscribe(
        ({ data }) => {
          const userObj = data as any;

          // send welcome registration email
          console.log(email);
          // this.emailService.sendRegistrationEmail(email).subscribe(
          //   (result) => {}
          // );

          // auth to snag token
          // this.authUserAccount({ email: model.email, password: model.matchingPassword.password }).then((token) => {
          //   userObj.token = token;
          //   // save user token to local storage
          //   this.cookieService.set('edm-token', token);

            resolve();
          // }, () => {
          //   console.log('err');
          // });
        }, err => {
          console.log('err', err);
          switch (err.message) {
            case 'GraphQL error: duplicate key value violates unique constraint "account_username_key"':
              alert('That username already exists, please select a new one!');
              break;
            case 'GraphQL error: duplicate key value violates unique constraint "user_account_email_key"':
              alert('The selected email already exists. Try resetting your password or use a new email address.');
              break;
            case 'GraphQL error: permission denied for function register_account':
              alert('Looks like you\'re still logged into another account. Make sure you\'re logged out or reload the page and try again');
              break;
            default:
              alert('There is an issue submitting your registration. Please reload and try again');
          }
          reject();
        }
      );
    });
  }

  follow(artistId: string, venueId: string, name: string) {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.createFollowListGQL.mutate({ userId: this.user.id, artistId, venueId }).subscribe(
          ({ data }) => {
            this.snackBar.open(`You are now following ${name}`, 'Close', {
              duration: 3000,
            });
            resolve(data.createFollowList.followList.id);
          }
        );
      } else {
        this.snackBar.open('Login to your account to add to watch list', 'Close', {
          duration: 3000,
        });
        resolve(null);
      }
    });
  }

  unfollow(followListId: number) {
    return new Promise((resolve, reject) => {
      this.removeFollowlistGQL.mutate({ followListId }).subscribe(
        () => resolve()
      );
    });
  }
}
