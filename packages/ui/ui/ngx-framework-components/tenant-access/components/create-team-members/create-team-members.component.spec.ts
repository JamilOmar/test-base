import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { UtilService } from '../../../services/util.service';
import { IdentityProvider } from '../../../shared/types';
import { NgxCoreServicesModule, ConfigService, SessionStorageService, WindowService, AuthService } from '@labshare/ngx-core-services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { WizardService } from '../../../services/wizard.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateTeamMembersComponent } from './create-team-members.component';
import { LocalStorageKeys } from '../../../shared/constants';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockConfigService {
    get() {
        return '/';
    }
}

describe(' CreateTeamMembersComponent', () => {
    let fixture: ComponentFixture<CreateTeamMembersComponent>;
    let component: CreateTeamMembersComponent;
    let utilService: UtilService;
    let router: Router;
    let wizardService: WizardService;
    let identityProviders: IdentityProvider[];
    let userTest;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
            declarations: [CreateTeamMembersComponent],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                UtilService,
                SessionStorageService,
                WindowService,
                AuthService,
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

        fixture = TestBed.createComponent(CreateTeamMembersComponent);
        component = fixture.componentInstance;
        utilService = TestBed.inject(UtilService);
        router = TestBed.inject(Router);
        wizardService = TestBed.inject(WizardService);
        identityProviders = [
            {
                id: 'nih',
                type: 'NIH',
            },
            {
                id: 'google',
                type: 'google',
            },
        ];
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    userTest = {
        email: 'joé.doe@nih.gov',
        firstName: 'Joé',
        lastName: 'Doe',
        role: 'Admin',
    };
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit() ', () => {
        it('should call ngoninit', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.NewMembers, JSON.stringify([userTest]));
            component.ngOnInit();
            expect(component.users).toEqual([userTest]);
        });
        it('should call Ngonintit ', () => {
            utilService.removeFromLocalStorage(LocalStorageKeys.NewMembers);
            component.ngOnInit();
            expect(component.users).toEqual([]);
        });

        it('should get identity providers', () => {
            spyOn(wizardService, 'getIdentityProviders').and.returnValue(of(identityProviders));
            fixture.detectChanges();
            expect(wizardService.getIdentityProviders).toHaveBeenCalled();
            expect(component.providerList.length).toBeGreaterThan(0);
        });

        it('should not get provider issuer when provider with given id is not found', () => {
            spyOn(wizardService, 'getIdentityProviders').and.returnValue(of([{ id: '123', type: 'nih' }]));
            fixture.detectChanges();
            expect(wizardService.getIdentityProviders).toHaveBeenCalled();
            expect(component.providerList.length).toEqual(1);
            expect(component.providerList[0].identityIssuer).toEqual('');
        });
    });

    describe('addUser()', () => {
        it('should add user', () => {
            component.teamForm.setValue({
                email: 'joé.doe@nih.gov',
                firstName: 'Joé',
                lastName: 'Doe',
                role: 'Admin',
                identityIssuer: 'http://accounts.google.com',
            });
            component.addUser();
            expect(component.users).toContain({
                email: 'joé.doe@nih.gov',
                firstName: 'Joé',
                lastName: 'Doe',
                role: 'Admin',
                identityIssuer: 'http://accounts.google.com',
            });
        });
    });

    describe('saveData()', () => {
        it('should go to next step', () => {
            spyOn(utilService, 'saveToLocalStorage').and.callThrough();
            component.saveData();
            expect(utilService.saveToLocalStorage).toHaveBeenCalled();
        });
    });

    describe('goToNextStep()', () => {
        it('should go to next step', () => {
            spyOn(router, 'navigate');
            spyOn(component, 'saveData').and.callThrough();
            component.goToNextStep();
            expect(router.navigate).toHaveBeenCalled();
            expect(component.saveData).toHaveBeenCalled();
        });
    });

    describe('goToPreviousStep()', () => {
        it('should go to next step', () => {
            spyOn(router, 'navigate');
            spyOn(component, 'saveData').and.callThrough();
            component.goToPreviousStep();
            expect(router.navigate).toHaveBeenCalled();
            expect(component.saveData).toHaveBeenCalled();
        });
    });
});
