import { TestBed, inject, getTestBed, async } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthGuardService } from './auth-guard.service';
import { SessionStorageService, AuthService, WindowService } from '@labshare/ngx-core-services';
import { UtilService } from './util.service';
import { UrlPath } from '../shared/constants';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TenantManagerService } from './tenant.manager.service';
import { Observable, scheduled, queueScheduler } from 'rxjs';

describe('AuthGuardService', () => {
    let injector;
    let authGardService: AuthGuardService;
    let authService: AuthService;
    let storage: SessionStorageService;
    let windowService: WindowService;
    let utilService: UtilService;
    let tenantManagerService: TenantManagerService;
    const origin = 'http://labshare.com';
    const route = { path: '/' };
    let afterLoginRoute;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                {
                    provide: SessionStorageService,
                    useValue: {
                        setItem(key, value) {
                            return value;
                        },
                        getItem(key) {
                            return '';
                        },
                        removeItem(key) {
                            return '';
                        },
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        isAuthorized() {
                            return of(true);
                        },
                        login() {
                            return;
                        },
                    },
                },
                {
                    provide: UtilService,
                    useValue: {
                        storeAfterLoginUrl(url): void {},
                    },
                },
                {
                    provide: WindowService,
                    useValue: {
                        nativeWindow: { location: { href: `${origin}/tenant/myteam`, origin } },
                    },
                },
                {
                    provide: TenantManagerService,
                    useValue: {
                        switchTenant(): Observable<unknown> {
                            return scheduled([{}], queueScheduler);
                        },
                    },
                },
            ],
        });

        injector = getTestBed();
        authGardService = injector.get(AuthGuardService);
        authService = injector.get(AuthService);
        storage = injector.get(SessionStorageService);
        windowService = injector.get(WindowService);
        utilService = injector.get(UtilService);
        tenantManagerService = injector.get(TenantManagerService);
        afterLoginRoute = windowService.nativeWindow.location.href.replace(windowService.nativeWindow.location.origin, '');
    });

    it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
        expect(service).toBeTruthy();
    }));

    describe('auth gard methods', () => {
        beforeEach(() => {
            spyOn(authGardService, 'checkUserAuthorization').and.returnValue(true);
        });

        it('should guard routes with canLoad', async(() => {
            authGardService.canLoad({ path: '/' });
            expect(authGardService.checkUserAuthorization).toHaveBeenCalled();
        }));

        it('should guard routes with canActivate', async(() => {
            authGardService.canActivate({ routeConfig: { path: '/' } } as ActivatedRouteSnapshot, null);
            expect(authGardService.checkUserAuthorization).toHaveBeenCalled();
        }));
    });

    describe('check user authorization', () => {
        it('should redirect to auth if user is not authorized', async(() => {
            spyOn(authService, 'isAuthorized').and.returnValue(of(false));
            spyOn(authService, 'login');
            authGardService.checkUserAuthorization(route);
            expect(authService.login).toHaveBeenCalled();
        }));

        it('should return true if user is authorized', async(() => {
            spyOn(authService, 'login');
            authGardService.checkUserAuthorization(route);
            expect(authService.login).not.toHaveBeenCalled();
            expect(authGardService.checkUserAuthorization(route)).toBe(true);
        }));
    });

    describe('switchTenant()', () => {
        it('should not store url if its root', async(() => {
            spyOn(utilService, 'storeAfterLoginUrl').and.callThrough();
            windowService.nativeWindow.location.href = origin + '/';
            authGardService.storeAfterLoginRoute(route);
            expect(utilService.storeAfterLoginUrl).not.toHaveBeenCalled();
        }));

        it('should store url into local storage', async(() => {
            spyOn(utilService, 'storeAfterLoginUrl').and.callThrough();
            spyOn(authGardService, 'switchTenant').and.callThrough();
            authGardService.storeAfterLoginRoute(route);
            expect(utilService.storeAfterLoginUrl).toHaveBeenCalledWith(afterLoginRoute);
            expect(authGardService.switchTenant).toHaveBeenCalledWith(route, afterLoginRoute);
        }));

        it('should switch tenant for Route', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            const routeCheck = { path: `tenant/${UrlPath.TenantIdRouteParam}` };
            authGardService.switchTenant(routeCheck, windowService.nativeWindow.location.href);
            expect(tenantManagerService.switchTenant).toHaveBeenCalled();
        }));

        it('should switch tenant for ActivatedRouteSnapshot', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            const routeCheck = { routeConfig: { path: `tenant/${UrlPath.TenantIdRouteParam}` } };
            authGardService.switchTenant(routeCheck as ActivatedRouteSnapshot, windowService.nativeWindow.location.href);
            expect(tenantManagerService.switchTenant).toHaveBeenCalled();
        }));

        it('should switch tenant to tenant id extracted from url', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.returnValue(of());
            const routeCheck = { routeConfig: { path: `tenant/${UrlPath.TenantIdRouteParam}` } };
            authGardService.switchTenant(routeCheck as ActivatedRouteSnapshot, '');
            expect(tenantManagerService.switchTenant).toHaveBeenCalledWith('', '');
        }));

        it('should not switch tenant if no tenant id', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            const routeCheck = { path: `tenant/` };
            authGardService.switchTenant(routeCheck, windowService.nativeWindow.location.href);
            expect(tenantManagerService.switchTenant).not.toHaveBeenCalled();
        }));

        it('should not switch tenant if provided tenant id matches the current tenantId', async(() => {
            spyOn(storage, 'getItem').and.returnValue(JSON.stringify({ tenant: 'myteam' }));
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            const routeCheck = { path: `tenant/${UrlPath.TenantIdRouteParam}` };
            authGardService.switchTenant(routeCheck, windowService.nativeWindow.location.href);
            expect(tenantManagerService.switchTenant).not.toHaveBeenCalled();
        }));
    });
});
