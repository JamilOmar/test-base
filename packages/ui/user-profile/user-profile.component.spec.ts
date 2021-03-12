import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { EventService, AuthService } from '@labshare/ngx-core-services';
import { By } from '@angular/platform-browser';
import { UserProfileEventKeys } from './user-profile.event-keys';
import { Component, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, Routes } from '@angular/router';

@Component({
    template: `Dashboard`,
})
export class DashboardComponent {}

@Component({
    template: `Other`,
})
export class OtherComponent {}

// tslint:disable:no-any
@Injectable()
class MockAuthService extends AuthService {
    responseType: any;
    isAuthorized() {
        return of(true);
    }
    configure() {
        const config: any = '';
        return config;
    }
    onAuthorizationResult() {
        const toReturn: any = of('authorized');
        return toReturn;
    }
    endSession() {}
    getAccessToken() {
        const accessToken = '';
        return accessToken;
    }
    getPayloadFromIdToken() {}
    getProfile() {
        return of({
            profile: {
                roles: ['Lab Admin', 'user'],
            },
        });
    }
    getRefreshToken() {
        const refreshToken = '';
        return refreshToken;
    }
    getState() {
        const state = '';
        return state;
    }
    isValidCodeFlowUri(url: string) {
        return true;
    }
    getIdToken() {
        const idToken = '';
        return idToken;
    }
    isValidImplicitFlowUri(url: string) {
        return true;
    }
    handleError() {}
    login() {}
    logout() {}
    onAuthCallback() {}
    setCustomRequestParametersForAuthorization() {}
    setState() {}
}

// tslint:disable:no-any
@Injectable()
class MockAuthService2 extends AuthService {
    responseType: any;
    isAuthorized() {
        return of(false);
    }
    configure() {
        const config: any = '';
        return config;
    }
    onAuthorizationResult() {
        const toReturn: any = of('authorized');
        return toReturn;
    }
    endSession() {}
    getAccessToken() {
        const accessToken = '';
        return accessToken;
    }
    getPayloadFromIdToken() {}
    getProfile() {
        return of({
            profile: {
                roles: ['Lab Admin', 'user'],
            },
        });
    }
    getRefreshToken() {
        const refreshToken = '';
        return refreshToken;
    }
    getState() {
        const state = '';
        return state;
    }
    isValidCodeFlowUri(url: string) {
        return true;
    }
    getIdToken() {
        const idToken = '';
        return idToken;
    }
    isValidImplicitFlowUri(url: string) {
        return true;
    }
    handleError() {}
    login() {}
    logout() {}
    onAuthCallback() {}
    setCustomRequestParametersForAuthorization() {}
    setState() {}
}

describe('UserProfileComponent', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    let eventService: EventService;
    let testBedService: AuthService;
    let componentService: AuthService;
    let location: Location;
    let router: Router;
    const routes: Routes = [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'other', component: OtherComponent },
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [UserProfileComponent],
            providers: [EventService, AuthService],
        }).compileComponents();
    }));

    beforeEach(() => {
        TestBed.overrideComponent(UserProfileComponent, {
            set: {
                providers: [{ provide: AuthService, useClass: MockAuthService }],
            },
        });
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        component.links = [
            { url: '#', text: 'link 1' },
            { url: '#', text: 'link 2' },
        ];
        testBedService = TestBed.inject(AuthService);
        componentService = fixture.debugElement.injector.get(AuthService);
        eventService = TestBed.inject(EventService);
        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load the user profile object', () => {
        const userProfile = { name: 'Main User', email: 'main@labshare.org', pictureUrl: 'http://none-image.io' };
        eventService.get(UserProfileEventKeys.UserProfile).next(userProfile);
        expect(component.userProfile).toEqual(userProfile);
    });

    it('should signout', (done: DoneFn) => {
        component.signOut();
        eventService.get(UserProfileEventKeys.UserProfileSignout).subscribe(signOut => {
            expect(signOut).toBeTruthy();
            done();
        });
    });

    it('should signin', (done: DoneFn) => {
        component.signIn();
        eventService.get(UserProfileEventKeys.UserProfileSignin).subscribe(signIn => {
            expect(signIn).toBeTruthy();
            done();
        });
    });

    it('should edit profile', () => {
        component.editProfile();
        expect(eventService.get(UserProfileEventKeys.UserProfileEdit).value).toEqual(true);
    });

    it('should disable link profile', () => {
        eventService.get(UserProfileEventKeys.EnableLink).next(true);
        expect(component.disableLink).toBeTruthy();
    });

    it('should load the links', () => {
        const elements = fixture.debugElement.queryAll(By.css('.profile-link'));
        expect(elements.length).toEqual(2);
    });

    it('should view account link', () => {
        component.viewAccount();
        expect(eventService.get(UserProfileEventKeys.ViewAccount).value).toEqual(true);
    });

    it('should update profile picture if it changes', () => {
        const userProfile = { name: 'Main User', email: 'main@labshare.org', pictureUrl: 'http://old.image.io' };
        eventService.get(UserProfileEventKeys.UserProfile).next(userProfile);
        eventService.get(UserProfileEventKeys.UserPictureChanged).next('http://new.image.io');
        expect(component.userProfile.pictureUrl).toEqual('http://new.image.io');
    });

    describe('"View dashboard" link', () => {
        it('should be disabled on dashboard routes', () => {
            fixture.ngZone.run(() => {
                router.navigate(['dashboard']).then(() => {
                    component.ngOnInit();
                    expect(router.url).toBe('/dashboard');
                    expect(component.disableViewDashboardLink).toEqual(true);
                    fixture.detectChanges();
                    const link = fixture.nativeElement.querySelector('.view-account a');
                    expect(link).toBeNull();
                });
            });
        });

        it('should not be disabled on non-dashboard routes', () => {
            fixture.ngZone.run(() => {
                router.navigate(['other']).then(() => {
                    component.ngOnInit();
                    expect(router.url).toBe('/other');
                    expect(component.disableViewDashboardLink).toEqual(false);
                    fixture.detectChanges();
                    const link = fixture.nativeElement.querySelector('.view-account a');
                    expect(link).toBeDefined();
                });
            });
        });
    });
});

describe('UserProfileComponent - user not logged in', () => {
    let component: UserProfileComponent;
    let fixture: ComponentFixture<UserProfileComponent>;
    let eventService: EventService;
    let testBedService: AuthService;
    let componentService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [UserProfileComponent],
            providers: [EventService, AuthService],
        }).compileComponents();
    }));

    beforeEach(() => {
        TestBed.overrideComponent(UserProfileComponent, {
            set: {
                providers: [{ provide: AuthService, useClass: MockAuthService2 }],
            },
        });
        fixture = TestBed.createComponent(UserProfileComponent);
        component = fixture.componentInstance;
        component.links = [
            { url: '#', text: 'link 1' },
            { url: '#', text: 'link 2' },
        ];
        testBedService = TestBed.inject(AuthService);
        componentService = fixture.debugElement.injector.get(AuthService);
        eventService = TestBed.inject(EventService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
