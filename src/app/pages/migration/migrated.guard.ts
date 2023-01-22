import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { MigrationService } from './migration.service';

@Injectable({
  providedIn: 'root',
})
export class MigratedGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private migrationService: MigrationService
  ) {}

  async canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (await this.migrationService.needsMigration()) {
      return this.router.parseUrl('/migrate');
    } else {
      return true;
    }
  }

  async canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
