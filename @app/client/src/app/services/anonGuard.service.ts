import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouterService } from './router.service';
import { UserService } from './user.service';

@Injectable()
export class AnonGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private routerService: RouterService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    // checks if logged in user and does not proceed if not
    if (this.userService.user.username) return true;

    this.routerService.navigateToPage('/login', { redirect: state.url });
    return false;
  }
}
