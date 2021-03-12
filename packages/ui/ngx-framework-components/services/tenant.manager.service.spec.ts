import { TestBed, inject, getTestBed, async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService, EventService, TenantService, WindowService, AuthService, SessionStorageService } from '@labshare/ngx-core-services';
import { TenantManagerService } from './tenant.manager.service';
import { UrlPath, AuthKeys, LocalStorageKeys } from '../shared/constants';
import { UtilService } from './util.service';
import { TenantNavEventKeys } from '@labshare/base-ui/tenant-nav';
import { UserProfileEventKeys } from '@labshare/base-ui/user-profile';
import { EventKeys as CoreServicesEventKeys } from '@labshare/ngx-core-services';
import { Tenant } from '../shared/types';
import { scheduled, queueScheduler } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('TenantManagerService', () => {
    let injector;
    let httpClient: HttpClient;
    let tenantManagerService: TenantManagerService;
    let config: ConfigService;
    let eventService: EventService;
    let tenantService: TenantService;
    let windowService: WindowService;
    let utilService: UtilService;
    let activatedRoute: ActivatedRoute;
    let authService: AuthService;
    let storageService: SessionStorageService;
    let router: Router;
    const apiUrl = 'api';
    const tenantId = 'id';
    const authTenantId = 1;
    const email = 'test@test.com';
    const redirectRoute = '/redirect';
    const tenants: Tenant[] = [
        {
            title: 'ncats1',
            id: 'tag1',
            description: 'ncats 1 desc',
        },
        {
            title: 'ncats1',
            id: 'tag2',
            description: 'ncats 2 desc',
        },
    ];

    const userProfile = {
        given_name: 'CureShare',
        family_name: 'User',
        name: 'CureShare User',
        email: 'CureShareUser@gmail.com',
        picture: 'http://none-image.io',
    };
    const authUrl = 'https://auth.host.com';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        getProfile() {
                            return of(userProfile);
                        },
                        logout() {
                            return;
                        },
                        getIdToken() {
                            return 'id_token';
                        },
                        authConfig: {
                            url: authUrl,
                        },
                    },
                },
                { provide: EventService, useClass: EventService },
                {
                    provide: ConfigService,
                    useValue: {
                        get() {
                            return apiUrl;
                        },
                    },
                },
                {
                    provide: UtilService,
                    useValue: {
                        getLoggedInUserProfile() {
                            return of({ email });
                        },
                        getFromLocalStorage(key) {
                            return redirectRoute;
                        },
                        removeFromLocalStorage(key) {
                            return;
                        },
                    },
                },
                {
                    provide: TenantService,
                    useValue: {
                        switchTenant(tenant: Tenant, afterLoginRoute?: string) {
                            return scheduled([{}], queueScheduler);
                        },
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { children: [{ params: { tenantId: '' } }] },
                    },
                },
                {
                    provide: WindowService,
                    useValue: {
                        nativeWindow: { location: { href: '' } },
                    },
                },
                {
                    provide: SessionStorageService,
                    useValue: {
                        getItem(key) {
                            return '{"tenant" : "test-tenant"}';
                        },
                        setItem(key, value) {},
                        removeItem(key) {
                            return '';
                        },
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigate(): void {},
                    },
                },
            ],
        });

        injector = getTestBed();
        httpClient = injector.get(HttpClient);
        tenantManagerService = injector.get(TenantManagerService);
        config = injector.get(ConfigService);
        eventService = injector.get(EventService);
        tenantService = injector.get(TenantService);
        windowService = injector.get(WindowService);
        utilService = injector.get(UtilService);
        authService = injector.get(AuthService);
        storageService = injector.get(SessionStorageService);
        activatedRoute = injector.get(ActivatedRoute);
        router = injector.get(Router);
    });

    it('should be created', inject([TenantManagerService], (service: TenantManagerService) => {
        expect(service).toBeTruthy();
    }));

    describe('getTenant', () => {
        it('should get the tenant by id', () => {
            spyOn(httpClient, 'get').and.returnValue(of({}));
            tenantManagerService.getTenant(tenantId);
            expect(httpClient.get).toHaveBeenCalledWith(`${apiUrl}${UrlPath.Tenant}/${tenantId}`);
        });
    });

    describe('getCurrentTenant', () => {
        it('should get the current tenant', () => {
            spyOn(tenantManagerService, 'getTenant').and.returnValue(of({} as Tenant));
            tenantManagerService.getCurrentTenant();
            expect(tenantManagerService.getTenant).toHaveBeenCalledWith('test-tenant');
        });

        it('should not get the current tenant if it cannot find the config from session storage', () => {
            spyOn(tenantManagerService, 'getTenant').and.returnValue(of({} as Tenant));
            spyOn(storageService, 'getItem').and.returnValue(null);
            tenantManagerService.getCurrentTenant();
            expect(tenantManagerService.getTenant).not.toHaveBeenCalled();
        });
    });

    describe('auth clients/tenant apps', () => {
        it('should get the clients/tenant apps for specified tenant', () => {
            spyOn(httpClient, 'get').and.returnValue(of([]));
            tenantManagerService.getClientsForTenant(authTenantId);
            expect(httpClient.get).toHaveBeenCalledWith(`${apiUrl}${UrlPath.AuthAdmin}/${authTenantId}/${UrlPath.Clients}`);
        });

        it('should return null when there are no clients', async(() => {
            spyOn(httpClient, 'get').and.returnValue(of([]));
            let result;
            tenantManagerService.getDefaultClientForTenant(authTenantId, tenantId).subscribe(r => (result = r));
            expect(result).toEqual(null);
            expect(httpClient.get).toHaveBeenCalledWith(
                `${apiUrl}${UrlPath.AuthAdmin}/${authTenantId}/${UrlPath.Clients}?filter[where][clientId]=${tenantId}_client`,
            );
        }));

        it('should return first client when there are clients', async(() => {
            spyOn(httpClient, 'get').and.returnValue(of(['a', 'b', 'c']));
            let result;
            tenantManagerService.getDefaultClientForTenant(authTenantId, tenantId).subscribe(r => (result = r));
            expect(result).toEqual('a');
            expect(httpClient.get).toHaveBeenCalledWith(
                `${apiUrl}${UrlPath.AuthAdmin}/${authTenantId}/${UrlPath.Clients}?filter[where][clientId]=${tenantId}_client`,
            );
        }));
    });

    describe('selecting and switching tenants', () => {
        it('should get a list of tenants', () => {
            const url = `${UrlPath.Users}/${email}/${UrlPath.Facilities}`;
            spyOn(httpClient, 'get').and.returnValue(of([]));
            tenantManagerService.getTenantsForUser(email);
            expect(httpClient.get).toHaveBeenCalledWith(apiUrl + url);
        });

        it('should fill the labshare menu with list of tenants', async(() => {
            spyOn(tenantManagerService, 'getTenantsForUser').and.returnValue(of(tenants));
            tenantManagerService.handleTenantListEvent();
            const menuTenants = eventService.get(TenantNavEventKeys.TenantList).getValue();
            expect(menuTenants.some(item => item.id === tenants[0].id)).toBe(true);
            expect(menuTenants.some(item => item.id === tenants[1].id)).toBe(true);
        }));

        describe('should properly handle the tenant switch events', () => {
            beforeEach(() => {
                spyOn(tenantManagerService, 'switchTenant').and.callThrough();
                spyOn(tenantService, 'switchTenant').and.callThrough();
                spyOn(config, 'get').and.returnValue('false');
                spyOn(tenantManagerService, 'getTenant').and.returnValue(scheduled([tenants[1]], queueScheduler));
                tenantManagerService.handleSelectTenantEvent(CoreServicesEventKeys.SwitchTenant, '/');
            });

            it('using menu object', async(() => {
                eventService.get(CoreServicesEventKeys.SwitchTenant).next({
                    id: tenants[1].id,
                    icon: 'test',
                    text: tenants[1].title,
                });
                expect(tenantManagerService.switchTenant).toHaveBeenCalledWith(tenants[1].id, '/');
                expect(tenantService.switchTenant).toHaveBeenCalledWith(tenants[1], tenants[1].id + AuthKeys.DefaultClientPattern, '/');
            }));

            it('using tenant id string', async(() => {
                eventService.get(CoreServicesEventKeys.SwitchTenant).next(tenants[1].id);
                expect(tenantManagerService.switchTenant).toHaveBeenCalledWith(tenants[1].id, '/');
                expect(tenantService.switchTenant).toHaveBeenCalledWith(tenants[1], tenants[1].id + AuthKeys.DefaultClientPattern, '/');
            }));

            it('should set auth audience', async(() => {
                eventService.get(CoreServicesEventKeys.SwitchTenant).next(tenants[1].id);
                expect(authService.authConfig.audience).toEqual(`${authUrl}${UrlPath.AuthBase}/${tenants[1].id}`);
            }));
        });

        it('should properly handle the tenant switch events using menu object', async(() => {
            eventService.get(CoreServicesEventKeys.SwitchTenant).next({
                id: tenants[1].id,
                icon: 'test',
                text: tenants[1].title,
            });
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            spyOn(tenantService, 'switchTenant').and.callThrough();
            spyOn(config, 'get').and.returnValue('false');
            spyOn(tenantManagerService, 'getTenant').and.returnValue(scheduled([tenants[1]], queueScheduler));
            tenantManagerService.handleSelectTenantEvent(CoreServicesEventKeys.SwitchTenant, '/');
            expect(tenantManagerService.switchTenant).toHaveBeenCalledWith(tenants[1].id, '/');
            expect(tenantService.switchTenant).toHaveBeenCalledWith(tenants[1], tenants[1].id + AuthKeys.DefaultClientPattern, '/');
        }));

        it('should not switch tenant if no tenant id is passed', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            eventService.get(CoreServicesEventKeys.SwitchTenant).next(null);
            tenantManagerService.handleSelectTenantEvent(CoreServicesEventKeys.SwitchTenant, '/');
            expect(tenantManagerService.switchTenant).not.toHaveBeenCalled();
        }));

        it('should not switch tenant if the same tenant id is passed', async(() => {
            spyOn(tenantManagerService, 'switchTenant').and.callThrough();
            activatedRoute.snapshot.children[0].params.tenantId = tenants[1].id;
            eventService.get(CoreServicesEventKeys.SwitchTenant).next({
                id: tenants[1].id,
                icon: 'test',
                text: tenants[1].title,
            });
            tenantManagerService.handleSelectTenantEvent(CoreServicesEventKeys.SwitchTenant, '/');
            expect(tenantManagerService.switchTenant).not.toHaveBeenCalled();
        }));

        it('should redirect to a route saved in local storage after authenticating', async(() => {
            spyOn(utilService, 'getFromLocalStorage').and.callThrough();
            spyOn(utilService, 'removeFromLocalStorage').and.callThrough();

            tenantManagerService.redirectToRightPlaceAfterLogin();

            expect(utilService.getFromLocalStorage).toHaveBeenCalledWith(LocalStorageKeys.RouteAfterLogin);
            expect(utilService.removeFromLocalStorage).toHaveBeenCalledWith(LocalStorageKeys.RouteAfterLogin);
            expect(windowService.nativeWindow.location.href).toEqual(redirectRoute);
        }));
    });
    it('should not redirect to a route if no value in local storage', async(() => {
        spyOn(utilService, 'getFromLocalStorage').and.returnValue(null);
        spyOn(utilService, 'removeFromLocalStorage').and.callThrough();

        tenantManagerService.redirectToRightPlaceAfterLogin();

        expect(utilService.getFromLocalStorage).toHaveBeenCalledWith(LocalStorageKeys.RouteAfterLogin);
        expect(utilService.removeFromLocalStorage).not.toHaveBeenCalledWith(LocalStorageKeys.RouteAfterLogin);
    }));

    it('should handle tenant events', async(() => {
        spyOn(tenantManagerService, 'handleLogoutEvent').and.callThrough();
        spyOn(tenantManagerService, 'handleProfileEvent').and.callThrough();

        tenantManagerService.handleTenantEvents();

        expect(tenantManagerService.handleLogoutEvent).toHaveBeenCalled();
        expect(tenantManagerService.handleProfileEvent).toHaveBeenCalled();
    }));

    it('should get the user profile and pass is to the event service ', async(() => {
        const evetServiceGet = spyOn(eventService, 'get').and.callThrough();
        const eventServiceNext = spyOn(eventService.get(UserProfileEventKeys.UserProfile), 'next').and.callThrough();
        const userProfileExpected = {
            name: `${userProfile.given_name} ${userProfile.family_name}`,
            email: userProfile.email,
            pictureUrl: userProfile.picture,
        };

        tenantManagerService.handleProfileEvent();

        expect(evetServiceGet).toHaveBeenCalledWith(UserProfileEventKeys.UserProfile);
        expect(eventServiceNext).toHaveBeenCalledWith(userProfileExpected);
    }));

    it('should log out when it receives the log out event', async(() => {
        spyOn(authService, 'logout').and.callThrough();

        tenantManagerService.handleLogoutEvent();
        eventService.get(UserProfileEventKeys.UserProfileSignout).next(true);

        expect(authService.logout).toHaveBeenCalled();
    }));

    it('should not log out when it receives the log out event with false value', async(() => {
        spyOn(authService, 'logout').and.callThrough();

        tenantManagerService.handleLogoutEvent();
        eventService.get(UserProfileEventKeys.UserProfileSignout).next(false);

        expect(authService.logout).not.toHaveBeenCalled();
    }));

    it('should not log out when it receives the log out event if there is no id token, just redirect to root', async(() => {
        spyOn(authService, 'logout').and.callThrough();
        spyOn(authService, 'getIdToken').and.returnValue('');
        spyOn(router, 'navigate').and.callThrough();

        tenantManagerService.handleLogoutEvent();
        eventService.get(UserProfileEventKeys.UserProfileSignout).next(true);

        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalled();
    }));

    describe('getImageUrl()', () => {
        it('should get absolute image url for metadata images', () => {
            const urlExpected = `${apiUrl}/images/metadata-image-id`;
            const url = tenantManagerService.getImageUrl('metadata-image-id');
            expect(url).toEqual(urlExpected);
        });

        it('should preserve url for external images with http://', () => {
            const url = tenantManagerService.getImageUrl('http://www.images.com/mylogo.jpg');
            expect(url).toEqual('http://www.images.com/mylogo.jpg');
        });

        it('should preserve url for external images with https://', () => {
            const url = tenantManagerService.getImageUrl('https://www.images.com/mylogo.jpg');
            expect(url).toEqual('https://www.images.com/mylogo.jpg');
        });
    });
});
