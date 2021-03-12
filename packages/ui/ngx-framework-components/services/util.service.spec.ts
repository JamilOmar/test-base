import { TestBed } from '@angular/core/testing';
import { NgxCoreServicesModule, ConfigService, AuthService, SessionStorageService, WindowService } from '@labshare/ngx-core-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilService } from './util.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageKeys } from '../shared/constants';

class MockConfigService {
    get() {
        return '/';
    }
}
class AuthServiceMock {
    authConfig: object;
    readonly responseType: string;
    refreshTokenFlow(refreshToken: string) {}
    onAuthorizationResult() {}
    isAuthorized() {}
    getProfile() {
        return of({ email: 'artem@nih.gov' });
    }
    login() {}
    logout() {}
    endSession() {}
    getAccessToken() {}
    getRefreshToken() {}
    configure() {}
    onAuthCallback() {}
    handleError() {}
    setCustomRequestParametersForAuthorization(params: { [key: string]: string | number | boolean }) {}
}

describe('UtilService', () => {
    let service: UtilService;
    let authService: AuthService;
    let sesService: SessionStorageService;
    let router: Router;
    let windowService: WindowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                { provide: AuthService, useClass: AuthServiceMock },
                SessionStorageService,
                WindowService,
            ],
        });
        service = TestBed.inject(UtilService);
        authService = TestBed.inject(AuthService);
        sesService = TestBed.inject(SessionStorageService);
        router = TestBed.inject(Router);
        windowService = TestBed.inject(WindowService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('checkAuth()', () => {
        it('should check auth and do nothing when logged in', () => {
            spyOn(authService, 'isAuthorized').and.returnValue(of(true));
            spyOn(authService, 'login').and.callThrough();
            service.checkAuth();
            expect(authService.isAuthorized).toHaveBeenCalled();
            expect(authService.login).not.toHaveBeenCalled();
        });

        it('should check auth and login when NOT logged in', async () => {
            spyOn(authService, 'isAuthorized').and.returnValue(of(false));
            spyOn(authService, 'login').and.returnValue();
            await service.checkAuth();
            expect(authService.isAuthorized).toHaveBeenCalled();
            expect(authService.login).toHaveBeenCalled();
        });
    });

    describe('getLoggedInUserProfile()', () => {
        it('should return profile data', () => {
            spyOn(authService, 'getProfile').and.returnValue(of({}));
            service.getLoggedInUserProfile();
            expect(authService.getProfile).toHaveBeenCalled();
        });
    });

    describe('saveToLocalStorage()', () => {
        it('should set storage data', () => {
            spyOn(sesService, 'setItem').and.callThrough();
            service.saveToLocalStorage('test', 'value');
            const val = sesService.getItem('test');
            expect(val).toEqual('value');
        });
    });

    describe('removeFromLocalStorage()', () => {
        it('should clear storage data', () => {
            sesService.setItem('test', 'value');
            spyOn(sesService, 'setItem').and.callThrough();
            service.removeFromLocalStorage('test');
            const val = sesService.getItem('test');
            expect(val).not.toEqual('value');
        });
    });

    describe('getFromLocalStorage()', () => {
        it('should get storage data', () => {
            sesService.setItem('test', 'value');
            spyOn(sesService, 'setItem').and.callThrough();
            const val = service.getFromLocalStorage('test');
            expect(val).toEqual('value');
        });
    });

    describe('storeAfterLoginUrl()', () => {
        it('should store the url', () => {
            spyOn(sesService, 'setItem').and.callThrough();
            const url = '/url';
            service.storeAfterLoginUrl(url);
            expect(sesService.setItem).toHaveBeenCalledWith(LocalStorageKeys.RouteAfterLogin, url);
        });
    });

    describe('getBaseUrlFromActivatedRoute()', () => {
        it('should return url with child routes', () => {
            const url = service.getBaseUrlFromActivatedRoute([
                { routeConfig: { path: null } } as ActivatedRoute,
                { routeConfig: { path: 'facilities' } } as ActivatedRoute,
                { routeConfig: { path: 'welcome' } } as ActivatedRoute,
            ]);
            expect(url).toEqual(windowService.nativeWindow.location.origin + '/' + 'facilities');
        });

        it('should return url without child routes', () => {
            const url = service.getBaseUrlFromActivatedRoute([{ routeConfig: { path: null } } as ActivatedRoute]);
            expect(url).toEqual(windowService.nativeWindow.location.origin);
        });
    });
});
