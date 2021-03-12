import { Injectable } from '@angular/core';
import { AuthService, AuthUserProfile, SessionStorageService, WindowService } from '@labshare/ngx-core-services';
import { Observable } from 'rxjs/internal/Observable';
import { LocalStorageKeys } from '../shared/constants';
import { ActivatedRoute } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UtilService {
    constructor(private auth: AuthService, private sessionStorage: SessionStorageService, private windowService: WindowService) {}

    public async checkAuth(): Promise<void> {
        if (await this.auth.isAuthorized().toPromise()) {
            return;
        }
        this.auth.login();
    }

    public getLoggedInUserProfile(): Observable<AuthUserProfile> {
        return this.auth.getProfile();
    }

    public saveToLocalStorage(key: string, val: string): void {
        this.sessionStorage.setItem(key, val);
    }

    public removeFromLocalStorage(key: string): void {
        this.sessionStorage.removeItem(key);
    }

    public getFromLocalStorage(key: string): string {
        return this.sessionStorage.getItem(key);
    }

    public storeAfterLoginUrl(url: string): void {
        this.sessionStorage.setItem(LocalStorageKeys.RouteAfterLogin, url);
    }

    public getBaseUrlFromActivatedRoute(pathFromRoot: ActivatedRoute[]): string {
        let fullPath = this.windowService.nativeWindow.location.origin;
        pathFromRoot.forEach((activatedRoute: ActivatedRoute, index) => {
            if (index !== 0 && index !== pathFromRoot.length - 1) {
                fullPath += `/${activatedRoute.routeConfig.path}`;
            }
        });
        return fullPath;
    }
}
