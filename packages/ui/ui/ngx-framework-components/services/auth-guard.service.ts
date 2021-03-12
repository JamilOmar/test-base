import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route } from '@angular/router';
import { AuthService, SessionStorageService, WindowService } from '@labshare/ngx-core-services';
import { UrlPath, AuthKeys } from '../shared/constants';
import { UtilService } from './util.service';
import { TenantManagerService } from './tenant.manager.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanLoad {
    constructor(
        private authService: AuthService,
        private storageService: SessionStorageService,
        public utilService: UtilService,
        public windowService: WindowService,
        public tenantManagerService: TenantManagerService,
    ) {}

    canLoad(route: Route): boolean {
        this.storeAfterLoginRoute(route);
        return this.checkUserAuthorization(route);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.storeAfterLoginRoute(route);
        return this.checkUserAuthorization(route);
    }

    checkUserAuthorization(route: Route | ActivatedRouteSnapshot): boolean {
        this.authService.isAuthorized().subscribe(authorized => {
            if (authorized === false) {
                this.authService.login();
            }
            return false;
        });
        return true;
    }

    storeAfterLoginRoute(route: Route | ActivatedRouteSnapshot) {
        let afterLoginRoute: string;
        afterLoginRoute = this.windowService.nativeWindow.location.href.replace(this.windowService.nativeWindow.location.origin, '');
        afterLoginRoute =
            afterLoginRoute.lastIndexOf('/') === afterLoginRoute.length - 1 ? afterLoginRoute.slice(0, afterLoginRoute.length - 1) : afterLoginRoute;
        if (!afterLoginRoute) {
            return;
        }
        this.utilService.storeAfterLoginUrl(afterLoginRoute);
        this.switchTenant(route, afterLoginRoute);
    }

    switchTenant(route: Route | ActivatedRouteSnapshot, afterLoginRoute: string) {
        const routePath: string = (route as ActivatedRouteSnapshot).routeConfig ? (route as ActivatedRouteSnapshot).routeConfig.path : (route as Route).path;
        if (routePath.includes(UrlPath.TenantIdRouteParam)) {
            const urlPatternMatch = routePath.replace(UrlPath.TenantIdRouteParam, '');
            let tenantId: string;
            tenantId = afterLoginRoute.substring(afterLoginRoute.indexOf(urlPatternMatch) + urlPatternMatch.length);
            tenantId = tenantId.split('/')[0] || tenantId;
            const authConfig = this.storageService.getItem(AuthKeys.AuthConfig);
            if (!authConfig || (JSON.parse(authConfig).tenant && JSON.parse(authConfig).tenant !== tenantId)) {
                this.tenantManagerService.switchTenant(tenantId, afterLoginRoute).subscribe();
            }
        }
    }
}
