import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteName } from '../shared/constants';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
    providedIn: 'root',
})
export class WizardGuardService extends AuthGuardService {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const afterLoginUrl = `${route.parent.data.baseRoute || ''}/${
            route.routeConfig.path === RouteName.AccessWorkspace ? RouteName.AccessWorkspace : RouteName.Profile
        }`;
        this.utilService.storeAfterLoginUrl(afterLoginUrl);
        return this.checkUserAuthorization(route);
    }
}
