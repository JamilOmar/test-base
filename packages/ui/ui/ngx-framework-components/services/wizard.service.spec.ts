import { TestBed } from '@angular/core/testing';
import { NgxCoreServicesModule, ConfigService, TenantService, AuthService, SessionStorageService } from '@labshare/ngx-core-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WizardService } from './wizard.service';
import { HttpClient } from '@angular/common/http';
import { UrlPath, RouteName, LocalStorageKeys, ConfigKeys } from '../shared/constants';
import { Tenant } from '../shared/types';
import { scheduled, queueScheduler, of } from 'rxjs';

describe('WizardService', () => {
    let service: WizardService;
    let http: HttpClient;
    let authService: AuthService;
    let tenantService: TenantService;
    let configService: ConfigService;
    let sessionStorageService: SessionStorageService;

    const userProfile = {
        email: 'eugene.krivenko@nih.gov',
        firstName: 'Eugene',
        lastName: 'Krivenko',
        displayName: 'Eugene Krivenko',
        jobTitle: 'Developer',
        organization: 'Organization',
    };
    const tenantTestId = 'pfizer';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, HttpClientTestingModule],
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get(key) {
                            switch (key) {
                                case ConfigKeys.DefaultAuthConfig:
                                    return { tenant: 'ls', clientId: 'client-id', createClientId: 'create-client-id' };
                                    break;
                                default:
                                    return '/';
                            }
                        },
                    },
                },
                {
                    provide: TenantService,
                    useValue: {
                        switchTenant(tenant: Tenant, clientId: string, silentToken, afterLoginRoute?: string) {
                            return scheduled([{}], queueScheduler);
                        },
                    },
                },
                {
                    provide: AuthService,
                    useValue: {
                        endSession() {
                            return;
                        },
                        configure(config) {
                            return;
                        },
                    },
                },
                {
                    provide: SessionStorageService,
                    useValue: {
                        removeItem(key) {},
                    },
                },
            ],
        });
        service = TestBed.inject(WizardService);
        authService = TestBed.inject(AuthService);
        tenantService = TestBed.inject(TenantService);
        configService = TestBed.inject(ConfigService);
        sessionStorageService = TestBed.inject(SessionStorageService);
        http = TestBed.inject(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAdminGroup()', () => {
        it('should get admin group', () => {
            let val;
            service.getAdminGroup().subscribe(v => (val = v));
            expect(val).toBeDefined();
            expect(val.id).toBeDefined();
            expect(val.name).toBeDefined();
        });
    });

    describe('getIdentityProviders()', () => {
        it('should call api', () => {
            spyOn(http, 'get');
            service.getIdentityProviders();
            expect(http.get).toHaveBeenCalledWith(UrlPath.Provider);
        });
    });

    describe('addStorage()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'post');
            service.addTenant({ id: 'test' } as Tenant);
            expect(spy.calls.mostRecent().args).toContain(UrlPath.Tenant);
            expect(spy.calls.mostRecent().args).toContain({ id: 'test' });
        });
    });

    describe('getRegularGroups()', () => {
        it('should get data', () => {
            let val;
            service.getRegularGroups().subscribe(v => (val = v));
            expect(val).toBeDefined();
        });
    });

    describe('addTenantUser()', () => {
        it('should call api', () => {
            const user = { facilityId: 'test' };
            const spy = spyOn(http, 'post');
            const url = `${UrlPath.Tenant}/${user.facilityId + UrlPath.Users}`;
            service.addTenantUser(user);
            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('updateProfile()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'patch');
            const url = `${UrlPath.Tenant}/${tenantTestId + UrlPath.Users}/${userProfile.email}`;

            service.updateProfile(tenantTestId, userProfile);

            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('updateSelfProfile()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'patch');
            const url = `${UrlPath.Tenant}/${tenantTestId + UrlPath.Users}/self`;

            service.updateSelfProfile(tenantTestId, userProfile);

            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('saveLogo()', () => {
        it('should call api', () => {
            const tenantId = 'test';
            const spy = spyOn(http, 'post');
            const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Logo}`;
            const file = new File([''], 'filename', { type: 'text/html' });
            service.saveLogo(tenantId, file);
            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('assignUserToGroup()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'put');
            const tenantId = 'tenantId';
            const group = 'group';
            const email = 'email';
            const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Groups}/${encodeURIComponent(group) + UrlPath.Users + UrlPath.Rel}/${email}`;
            service.assignUserToGroup(tenantId, group, email);
            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('getTenantsForUser()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'get');
            const email = 'email';
            const url = `${UrlPath.Users}/${email + UrlPath.Tenant}`;
            service.getTenantsForUser(email);
            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });

    describe('startNewTenantProcess()', () => {
        const baseUrl = 'http://cureshare.io/tenants';

        it('should properly start the tenant creation process', () => {
            const authConfig = configService.get(ConfigKeys.DefaultAuthConfig);
            spyOn(configService, 'get').and.returnValue(authConfig);
            spyOn(authService, 'endSession').and.callThrough();
            spyOn(tenantService, 'switchTenant').and.callThrough();

            service.setBaseRoute(baseUrl);
            service.startNewTenantProcess();

            expect(tenantService.switchTenant).toHaveBeenCalledWith({ id: authConfig.tenant }, authConfig.createClientId, baseUrl + '/' + RouteName.Profile);
        });

        it('should remove the previous tenant information before starting the tenant creation process', () => {
            spyOn(sessionStorageService, 'removeItem').and.callThrough();
            service.setBaseRoute(baseUrl);
            service.startNewTenantProcess();

            expect(sessionStorageService.removeItem).toHaveBeenCalledTimes(2);
            expect(sessionStorageService.removeItem).toHaveBeenCalledWith(LocalStorageKeys.ProfileInfo);
            expect(sessionStorageService.removeItem).toHaveBeenCalledWith(LocalStorageKeys.TenantInfo);
        });
    });

    describe('accessExistingTenant()', () => {
        const baseUrl = 'http://cureshare.io/tenants';

        it('should properly start the tenant creation process', () => {
            const authConfig = configService.get(ConfigKeys.DefaultAuthConfig);
            spyOn(configService, 'get').and.returnValue(authConfig);
            spyOn(authService, 'endSession').and.callThrough();
            spyOn(tenantService, 'switchTenant').and.callThrough();

            service.accessExistingTenant();

            expect(tenantService.switchTenant).toHaveBeenCalledWith({ id: authConfig.tenant }, authConfig.clientId, UrlPath.Dashboard);
        });

        it('should remove the previous tenant information before starting the tenant creation process', () => {
            spyOn(sessionStorageService, 'removeItem').and.callThrough();
            service.setBaseRoute(baseUrl);
            service.startNewTenantProcess();

            expect(sessionStorageService.removeItem).toHaveBeenCalledTimes(2);
            expect(sessionStorageService.removeItem).toHaveBeenCalledWith(LocalStorageKeys.ProfileInfo);
            expect(sessionStorageService.removeItem).toHaveBeenCalledWith(LocalStorageKeys.TenantInfo);
        });
    });

    describe('ensureTenant()', () => {
        it('should call api', () => {
            const spy = spyOn(http, 'get').and.returnValue(of({ exists: false }));
            const url = `${UrlPath.EnsureTenant}/test-tenant`;
            let result;
            service.ensureTenant('test-tenant').subscribe(r => (result = r));
            expect(result).toEqual(false);
            expect(spy.calls.mostRecent().args).toContain(url);
        });
    });
});
