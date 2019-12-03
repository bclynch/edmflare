import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(
    public router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    // const expectedRole: string[] = route.data.expectedRole;
    // if (this.cookieService.get('edm-token')) {
    //   // decode the token to get its payload
    //   const tokenPayload = decode(this.cookieService.get('edm-token'));
    //   console.log(tokenPayload);
    //   if (!tokenPayload) return false;

    //   if (expectedRole.indexOf(tokenPayload.role) === -1) {
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    return true;
  }
}
