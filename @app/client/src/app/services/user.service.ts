import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CurrentUserGQL, CreateFollowListGQL, RemoveFollowlistGQL, LogoutGQL, LoginGQL, RegisterGQL } from '../generated/graphql';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  public signedIn: Observable<boolean>;
  public signedInSubject: BehaviorSubject<boolean>;
  user = null;

  constructor(
    private apollo: Apollo,
    private loginGQL: LoginGQL,
    private registerGQL: RegisterGQL,
    private currentUserGQL: CurrentUserGQL,
    private createFollowListGQL: CreateFollowListGQL,
    private removeFollowlistGQL: RemoveFollowlistGQL,
    private snackBar: MatSnackBar,
    private logoutGQL: LogoutGQL,
    private router: Router,
  ) {
    this.signedInSubject = new BehaviorSubject<boolean>(false);
    this.signedIn = this.signedInSubject;
  }

  fetchUser(): Promise<string> {
    return new Promise((resolve) => {
      this.currentUserGQL.fetch().subscribe(
        ({ data }) => {
          console.log(data);
          if (data && data.currentUser) {
            this.user = data.currentUser;
            this.signedInSubject.next(true);
          }
          resolve();
        },
        () => resolve()
      );
    });
  }

  loginUser({ username, password }: { username: string; password: string; }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loginGQL.mutate({ username, password }).subscribe(({ data }) => {
        this.signedInSubject.next(true);
        this.user = data.login.user;
        // reset apollo cache and refetch queries
        this.apollo.getClient().resetStore();
        resolve();
      }, (error) => {
        console.log('there was an error sending the query', error);
        alert('The email or password is incorrect. Please check your account information and login again');
        reject();
      });
    });
  }

  logoutUser(): void {
    this.logoutGQL.mutate().subscribe(({ data }) => {
      if (data.logout.success) {
        // reset apollo cache and refetch queries
        this.signedInSubject.next(false);
        this.user = null;
        this.apollo.getClient().resetStore();
        this.router.navigateByUrl('/');
      }
    });
  }

  registerUserAccount({ username, email, matchingPassword }: { username: string; email: string; matchingPassword: { password: string; } }): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.registerGQL.mutate({ username, email, password: matchingPassword.password }).subscribe(
        ({ data }) => {
          this.user = data.register.user;
          this.signedInSubject.next(true);
          resolve();
        }, err => {
          console.log('err', err);
          switch (err.message) {
            case 'GraphQL error: An account using that email address has already been created.':
              alert('That email already exists. Try logging in or using a new one.');
              break;
            case 'GraphQL error: Conflict occurred':
              alert('That username username already exists. Try logging in or using a new one.');
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

  follow(artistId: string, venueId: string, name: string): Promise<number> {
    return new Promise<number>((resolve) => {
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

  unfollow(followListId: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.removeFollowlistGQL.mutate({ followListId }).subscribe(
        () => resolve()
      );
    });
  }
}
