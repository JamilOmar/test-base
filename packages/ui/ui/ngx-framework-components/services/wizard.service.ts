import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService, AuthService, TenantService, SessionStorageService } from '@labshare/ngx-core-services';
import { from, of, Observable } from 'rxjs';
import { Tenant, User, Group, IdentityProvider, ExistsResponse } from '../shared/types';
import { UrlPath, ConfigKeys, RouteName, LocalStorageKeys } from '../shared/constants';
import { map } from 'rxjs/operators';
import * as urljoin from 'url-join';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

@Injectable({
    providedIn: 'root',
})
export class WizardService {
    private baseUrl;
    private baseRoute: string;
    private authConfig;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private authService: AuthService,
        private tenantService: TenantService,
        private sessionStorageService: SessionStorageService,
    ) {
        this.baseUrl = this.configService.get(UrlPath.Api);
        this.authConfig = this.configService.get(ConfigKeys.DefaultAuthConfig);
    }

    public setBaseRoute(baseRoute: string) {
        this.baseRoute = baseRoute;
    }

    startNewTenantProcess() {
        const routeAfterLogin = urljoin(this.baseRoute, RouteName.Profile);
        this.setupForAccessTeamsStartNewTenant(routeAfterLogin, this.authConfig.createClientId);
    }

    accessExistingTenant() {
        this.setupForAccessTeamsStartNewTenant(UrlPath.Dashboard, this.authConfig.clientId);
    }

    private setupForAccessTeamsStartNewTenant(routeAfterLogin: string, clientId: string) {
        this.sessionStorageService.removeItem(LocalStorageKeys.ProfileInfo);
        this.sessionStorageService.removeItem(LocalStorageKeys.TenantInfo);
        this.authService.endSession();
        this.tenantService.switchTenant({ id: this.authConfig.tenant }, clientId, routeAfterLogin).subscribe();
    }

    getAdminGroup() {
        return of({
            id: 1,
            name: 'Lab Admin',
            description: 'has full edit rights and administrative privileges',
        });
    }

    getIdentityProviders(): Observable<Array<IdentityProvider>> {
        return this.http.get<IdentityProvider[]>(urljoin(this.baseUrl, UrlPath.Provider));
    }

    getRegularGroups() {
        const groups: Group[] = [
            {
                name: 'Lab Admin',
                description: 'has full edit rights and administrative privileges',
            },
            {
                name: 'Lab Staff',
                description: 'has some edit rights but no administrative privileges',
            },
            {
                name: 'Lab User',
                description: 'has some edit rights',
            },
            {
                name: 'Public',
                description: 'can only read content',
            },
        ];
        return from(groups);
    }

    addTenant(tenant: Tenant): Observable<object> {
        return this.http.post(urljoin(this.baseUrl, UrlPath.Tenant), tenant, httpOptions);
    }

    addTenantUser(user: User) {
        const userUrl = `${UrlPath.Tenant}/${user.facilityId + UrlPath.Users}`;
        return this.http.post<User>(urljoin(this.baseUrl, userUrl), user, httpOptions);
    }

    updateProfile(tenantId: string, user: User): Observable<void> {
        const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Users}/${user.email}`;

        return this.http.patch<void>(urljoin(this.baseUrl, url), user, httpOptions);
    }

    updateSelfProfile(tenantId: string, user: User): Observable<void> {
        const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Users}/self`;
        return this.http.patch<void>(urljoin(this.baseUrl, url), user, httpOptions);
    }

    saveLogo(tenantId: string, logo: File) {
        const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Logo}`;
        const formData: FormData = new FormData();
        formData.append(logo.name, logo, logo.name);
        return this.http.post(urljoin(this.baseUrl, url), formData);
    }

    assignUserToGroup(tenantId: string, groupName: string, userEmail: string) {
        const url = `${UrlPath.Tenant}/${tenantId + UrlPath.Groups}/` + `${encodeURIComponent(groupName)}${UrlPath.Users}${UrlPath.Rel}/${userEmail}`;
        return this.http.put(urljoin(this.baseUrl, url), null, httpOptions);
    }

    getTenantsForUser(email: string) {
        const url = `${UrlPath.Users}/${email + UrlPath.Tenant}`;
        return this.http.get<Tenant[]>(urljoin(this.baseUrl, url));
    }

    ensureTenant(tenantId: string) {
        const url = `${UrlPath.EnsureTenant}/${tenantId}`;
        return this.http.get<ExistsResponse>(urljoin(this.baseUrl, url)).pipe(map(result => result.exists));
    }
}
