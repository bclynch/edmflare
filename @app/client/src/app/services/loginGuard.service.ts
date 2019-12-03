import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginGuardService implements CanActivate {

  constructor(
    public router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    // for now this is better than the user service method because it isn't async and waiting for server
    // its possible the token could be expired, but this is a solid bet
    // if there's a token they shouldn't go to login because they are alreay logged in
    // const token = this.cookieService.get('edm-token');
    // if (token) this.router.navigate(['/']);
    return true;
  }
}
