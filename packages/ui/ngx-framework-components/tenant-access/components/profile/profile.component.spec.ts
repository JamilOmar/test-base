import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TestingUtilities } from '../../../testing/testing-utilities';
import { ProfileComponent } from './profile.component';
import { UtilService } from '../../../services/util.service';
import { LocalStorageKeys } from '../../../shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigService, NgxCoreServicesModule, WindowService, SessionStorageService, AuthService, AuthUserProfile } from '@labshare/ngx-core-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class FakeAuthService {
    public endSession() {}
}

describe('ProfileComponent', () => {
    let fixture: ComponentFixture<ProfileComponent>;
    let component: ProfileComponent;
    let utilService: UtilService;
    let router: Router;
    let profileInfo;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            declarations: [ProfileComponent],
            providers: [
                ConfigService,
                UtilService,
                SessionStorageService,
                WindowService,
                {
                    provide: AuthService,
                    useClass: FakeAuthService,
                },
                { provide: APP_BASE_HREF, useValue: '/' },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 123 }),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        utilService = TestBed.inject(UtilService);
        router = TestBed.inject(Router);
        profileInfo = {
            email: 'joé.doe@nih.gov',
            firstName: 'Joé',
            lastName: 'Doe',
            displayName: 'Joé Doe',
            jobTitle: 'developer',
            organization: 'Organization',
        };
    });

    afterEach(() => {
        component.ngOnDestroy();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit()', () => {
        it('should load all the form values', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify(profileInfo));

            fixture.detectChanges();

            const email = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='email']`);
            const firstName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='firstName']`);
            const lastName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='lastName']`);
            const displayName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='displayName']`);
            const jobTitle = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='jobTitle']`);
            const organization = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='organization']`);

            expect(email.value).toBe(profileInfo.email);
            expect(firstName.value).toBe(profileInfo.firstName);
            expect(lastName.value).toBe(profileInfo.lastName);
            expect(displayName.value).toBe(profileInfo.displayName);
            expect(jobTitle.value).toBe(profileInfo.jobTitle);
            expect(organization.value).toBe(profileInfo.organization);
        });

        it('should set profileForm values in null or none content - storedValues has none data', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify({}));

            component.ngOnInit();

            expect(component.profileForm.controls.email.value).toBe('');
            expect(component.profileForm.controls.firstName.value).toBe('');
            expect(component.profileForm.controls.lastName.value).toBe('');
            expect(component.profileForm.controls.displayName.value).toBe('');
            expect(component.profileForm.controls.jobTitle.value).toBe('');
            expect(component.profileForm.controls.organization.value).toBe('');
        });

        it('should set default values', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify({}));

            const email = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='email']`);
            const firstName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='firstName']`);
            const lastName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='lastName']`);
            const displayName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='displayName']`);
            const jobTitle = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='jobTitle']`);
            const organization = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='organization']`);

            expect(email.value).not.toBe(profileInfo.email);
            expect(firstName.value).not.toBe(profileInfo.firstName);
            expect(lastName.value).not.toBe(profileInfo.lastName);
            expect(displayName.value).not.toBe(profileInfo.displayName);
            expect(jobTitle.value).not.toBe(profileInfo.jobTitle);
            expect(organization.value).not.toBe(profileInfo.organization);
        });

        it('should return default values if no stored values ', () => {
            const authProfile = { email: 'test', given_name: 'Joe', family_name: 'Doe' } as AuthUserProfile;
            spyOn(utilService, 'getLoggedInUserProfile').and.returnValue(of(authProfile));
            utilService.removeFromLocalStorage(LocalStorageKeys.ProfileInfo);
            component.ngOnInit();

            const email = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='email']`);
            const firstName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='firstName']`);
            const lastName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='lastName']`);
            const displayName = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='displayName']`);
            const jobTitle = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='jobTitle']`);
            const organization = TestingUtilities.getNativeElement(fixture, `input[formcontrolname='organization']`);

            expect(email.value).not.toBe(profileInfo.email);
            expect(firstName.value).not.toBe(profileInfo.firstName);
            expect(lastName.value).not.toBe(profileInfo.lastName);
            expect(displayName.value).not.toBe(profileInfo.displayName);
            expect(component.profileForm.controls.displayName.value).toEqual(authProfile.given_name + ' ' + authProfile.family_name);
            expect(jobTitle.value).not.toBe(profileInfo.jobTitle);
            expect(organization.value).not.toBe(profileInfo.organization);
        });

        it('should valide include space and dashes in fistName and lastname fields', () => {
            const invaidText = 'Test_Space5';
            const validText = 'Test Space-Test';
            component.profileForm.controls.firstName.setValue(invaidText);
            let invalid = component.profileForm.controls.firstName.valid;
            expect(invalid).toBeFalsy();
            component.profileForm.controls.firstName.setValue(validText);
            let valid = component.profileForm.controls.firstName.valid;
            expect(valid).toBeTruthy();

            component.profileForm.controls.lastName.setValue(invaidText);
            invalid = component.profileForm.controls.lastName.valid;
            expect(invalid).toBeFalsy();
            component.profileForm.controls.lastName.setValue(valid);
            valid = component.profileForm.controls.lastName.valid;
            expect(valid).toBeTruthy();
        });
    });

    it('should save all the form values', () => {
        utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify(profileInfo));
        fixture.detectChanges();
        utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify({}));

        component.save();

        expect(JSON.parse(utilService.getFromLocalStorage(LocalStorageKeys.ProfileInfo))).toEqual(profileInfo);
    });

    describe('goToNextStep()', () => {
        it('should go to next step', () => {
            spyOn(router, 'navigate');
            spyOn(component, 'save').and.callThrough();

            component.goToNextStep();

            expect(router.navigate).toHaveBeenCalled();
            expect(component.save).toHaveBeenCalled();
        });
    });

    describe('goToPreviousStep()', () => {
        it('should go to next step', () => {
            spyOn(router, 'navigate');
            spyOn(component, 'save').and.callThrough();
            component.goToPreviousStep();
            expect(router.navigate).toHaveBeenCalled();
            expect(component.save).toHaveBeenCalled();
        });
    });

    describe('updateDisplayName()', () => {
        it('should update the display name', () => {
            component.profileForm.controls.firstName.setValue('hello');
            component.profileForm.controls.lastName.setValue('world');
            component.updateDisplayName();
            expect(component.profileForm.controls.displayName.value).toEqual('hello world');
        });
    });
});
