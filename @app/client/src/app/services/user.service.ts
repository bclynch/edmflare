import { Apollo } from 'apollo-angular';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CurrentUserGQL,
  CreateFollowListGQL,
  RemoveFollowlistGQL,
  LogoutGQL,
  LoginGQL,
  RegisterGQL
} from '../generated/graphql';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

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
    private logoutGQL: LogoutGQL,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.signedInSubject = new BehaviorSubject<boolean>(false);
    this.signedIn = this.signedInSubject;
  }

  fetchUser(): Promise<void> {
    return new Promise((resolve) => {
      // we don't really care about user info on the server and don't have access to the cookie anyway
      // so if serverside then we can just resolve
      // wondering if this will mess up the app init...
      if (isPlatformServer(this.platformId)) {
        resolve();
      }

      this.currentUserGQL.fetch().subscribe(
        ({ data: { currentUser } = {} }) => {
          if (currentUser) {
            this.user = currentUser;
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
        this.apollo.client.resetStore();
        resolve();
      }, (error) => {
        console.log('there was an error sending the query', error);
        alert('The email or password is incorrect. Please check your account information and login again');
        reject();
      });
    });
  }

  logoutUser() {
    return new Promise<string>((resolve, reject) => {
      this.logoutGQL.mutate().subscribe(({ data }) => {
        if (data.logout.success) {
          // reset apollo cache and refetch queries
          this.signedInSubject.next(false);
          this.user = null;
          this.apollo.client.resetStore();
          this.router.navigateByUrl('/');
          resolve('Your have successfully logged out');
        } else {
          reject();
        }
      });
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

  follow(artistId: string, venueId: string, name: string) {
    return new Promise<{ data: number; message: string; }>((resolve) => {
      if (this.user) {
        this.createFollowListGQL.mutate({ userId: this.user.id, artistId, venueId }).subscribe(
          ({ data }) => {
            resolve({ data: data.createFollowList.followList.id, message: `You are now following ${name}` });
          }
        );
      } else {
        resolve({ data: null, message: 'Login to your account to add to follow list' });
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
