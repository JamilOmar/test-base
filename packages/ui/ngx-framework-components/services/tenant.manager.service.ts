import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    ConfigService,
    EventService,
    TenantService,
    WindowService,
    AuthService,
    SessionStorageService,
    EventKeys as CoreServicesEventKeys,
    AuthUserProfile,
} from '@labshare/ngx-core-services';
import { TenantNavEventKeys, Tenant as TenantNavItem } from '@labshare/base-ui/tenant-nav';
import { UserProfileEventKeys } from '@labshare/base-ui/user-profile';
import { of } from 'rxjs';
import { Tenant, Client } from '../shared/types';
import { UrlPath, AuthKeys, LocalStorageKeys } from '../shared/constants';
import { concatMap, mergeMap, switchMap } from 'rxjs/operators';
import { UtilService } from './util.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as urljoin from 'url-join';

@Injectable({
    providedIn: 'root',
})
export class TenantManagerService {
    private baseUrl: string;
    private authApiBaseUrl: string;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private utilService: UtilService,
        private eventService: EventService,
        private tenantService: TenantService,
        private activatedRoute: ActivatedRoute,
        private windowService: WindowService,
        private authService: AuthService,
        private storageService: SessionStorageService,
        private router: Router,
    ) {
        this.baseUrl = this.configService.get(UrlPath.Api);
        this.authApiBaseUrl = this.configService.get(UrlPath.Auth);
    }

    getTenant(tenantId: string) {
        const url = `${UrlPath.Tenant}/${tenantId}`;

        return this.http.get<Tenant>(urljoin(this.baseUrl, url));
    }

    getCurrentTenant() {
        const tenantConfig = this.storageService.getItem(AuthKeys.AuthConfig);
        const tenantId = tenantConfig ? JSON.parse(tenantConfig).tenant : null;
        if (tenantId) {
            this.getTenant(tenantId).subscribe((tenant: Tenant) => {
                this.eventService.get(CoreServicesEventKeys.Tenant).next(tenant);
            });
        }
    }

    getClientsForTenant(authTenantId: number) {
        const url = `${UrlPath.AuthAdmin}/${authTenantId}/${UrlPath.Clients}`;
        return this.http.get<Client>(urljoin(this.authApiBaseUrl, url));
    }

    getDefaultClientForTenant(authTenantId: number, tenantId: string) {
        const url = `${UrlPath.AuthAdmin}/${authTenantId}/${UrlPath.Clients}?filter[where][clientId]=${tenantId + AuthKeys.DefaultClientPattern}`;
        return this.http.get<Client[]>(urljoin(this.authApiBaseUrl, url)).pipe(
            concatMap((clients: Client[]) => {
                const client: Client = clients && clients[0] ? clients[0] : null;
                return of(client);
            }),
        );
    }

    getTenantsForUser(email: string) {
        const url = `${UrlPath.Users}/${email}/${UrlPath.Facilities}`;

        return this.http.get<Tenant[]>(urljoin(this.baseUrl, url));
    }

    getImageUrl(imageUri: string) {
        if (!imageUri || imageUri.length === 0) {
            return '';
        }
        if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
            return imageUri;
        }
        return urljoin(this.baseUrl, 'images', imageUri);
    }

    handleTenantListEvent() {
        this.utilService
            .getLoggedInUserProfile()
            .pipe(switchMap(profile => this.getTenantsForUser(profile.email)))
            .subscribe((tenants: Tenant[]) => {
                const tenantNavItems = tenants.map(f => ({
                    text: f.title,
                    id: f.id,
                    logo: this.getImageUrl(f.logo),
                }));
                this.eventService.get(TenantNavEventKeys.TenantList).next(tenantNavItems);
            });
    }

    handleSelectTenantEvent(eventKey: string, tenantRoute: string) {
        this.eventService
            .get(eventKey)
            .pipe(mergeMap((item: TenantNavItem | string) => this.processSwitchTenant(item, tenantRoute)))
            .subscribe();
    }

    processSwitchTenant(item: TenantNavItem | string, tenantRoute: string) {
        if (!item) {
            return of('');
        }
        const tenantId = typeof item !== 'string' ? item.id : item;
        if (
            this.activatedRoute.snapshot &&
            this.activatedRoute.snapshot.children.length > 0 &&
            this.activatedRoute.snapshot.children[0].params.tenantId &&
            this.activatedRoute.snapshot.children[0].params.tenantId === tenantId
        ) {
            return of({});
        }
        return this.switchTenant(tenantId, tenantRoute.replace(UrlPath.TenantIdPattern, tenantId));
    }

    switchTenant(tenantId: string, tenantRoute: string) {
        const audience = `${this.authService.authConfig.url}${UrlPath.AuthBase}/${tenantId}`;
        this.authService.authConfig = { ...this.authService.authConfig, audience };
        return this.getTenant(tenantId).pipe(
            concatMap((tenant: Tenant) => this.tenantService.switchTenant(tenant, tenant.id + AuthKeys.DefaultClientPattern, tenantRoute)),
        );
    }

    redirectToRightPlaceAfterLogin() {
        this.storageService.removeItem(LocalStorageKeys.SwitchingTenants);
        const routeAfterLogin = this.utilService.getFromLocalStorage(LocalStorageKeys.RouteAfterLogin);
        if (routeAfterLogin) {
            this.utilService.removeFromLocalStorage(LocalStorageKeys.RouteAfterLogin);
            this.windowService.nativeWindow.location.href = routeAfterLogin;
        }
    }

    handleLogoutEvent() {
        this.eventService.get(UserProfileEventKeys.UserProfileSignout).subscribe(shouldLogOut => {
            if (shouldLogOut) {
                if (!this.authService.getIdToken()) {
                    this.router.navigate(['/']);
                    return;
                }
                this.storageService.removeItem(AuthKeys.AuthConfig);
                this.authService.logout();
            }
        });
    }

    handleProfileEvent() {
        this.authService.getProfile().subscribe((profile: AuthUserProfile) => {
            this.eventService
                .get(UserProfileEventKeys.UserProfile)
                .next({ name: `${profile.given_name} ${profile.family_name}`, email: profile.email, pictureUrl: profile.picture });
        });
    }

    handleTenantEvents() {
        this.handleLogoutEvent();
        this.handleProfileEvent();
    }
}
