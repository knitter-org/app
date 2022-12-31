import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { InitializationService } from './initialization.service';

@Injectable({
  providedIn: 'root'
})
export class InitializedGuardService implements CanActivate {

  constructor(
    private router: Router,
    private initializationService: InitializationService
    ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (await this.initializationService.isInitialized()) {
      return true;
    } else {
      this.router.navigate(['initialize']);
      return false;
    }
  }
}
