import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { UtilService } from '../../../services/util.service';
import { LocalStorageKeys, MessageErrorCode } from '../../../shared/constants';
import { Tenant, User } from '../../../shared/types';
import { NgxCoreServicesModule, ConfigService, SessionStorageService, WindowService, AuthService, EventService } from '@labshare/ngx-core-services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { WizardService } from '../../../services/wizard.service';
import { CreateTenantComponent } from './create-tenant.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { queueScheduler, scheduled, throwError } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

class MockConfigService {
    get() {
        return '/';
    }
}

describe('CreateTenantComponent', () => {
    let fixture: ComponentFixture<CreateTenantComponent>;
    let component: CreateTenantComponent;
    let utilService: UtilService;
    let sessionStorageService: SessionStorageService;
    let router: Router;
    let tenantResults: Tenant;
    let wizardService: WizardService;
    let modalService: NgbModal;

    const newTeam = { title: 'test', id: 1 };

    const tenantInfo: Tenant = {
        title: 'ncats',
        id: 'ncats-1',
        description: 'main facility at ncats',
        authTenantId: 1,
    };

    const profileInfo: User = {
        email: 'joé.doe@nih.gov',
        firstName: 'Joé',
        lastName: 'Doe',
        displayName: 'Joé Doe',
        jobTitle: 'developer',
        organization: 'Organization',
        facilityId: tenantInfo.id,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxCoreServicesModule,
                ReactiveFormsModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                NgbModule,
                RouterTestingModule.withRoutes([]),
            ],
            declarations: [CreateTenantComponent],
            providers: [
                { provide: ConfigService, useClass: MockConfigService },
                UtilService,
                SessionStorageService,
                WindowService,
                AuthService,
                EventService,
                { provide: APP_BASE_HREF, useValue: '/' },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ id: 123 }),
                    },
                },
                {
                    provide: WizardService,
                    useValue: {
                        addTenant(tenant: Tenant) {
                            tenantResults = tenant;
                            return scheduled([tenantResults], queueScheduler);
                        },
                        ensureTenant() {
                            return scheduled([true], queueScheduler);
                        },
                        updateSelfProfile(tenantId: string, user: User) {
                            return scheduled([{}], queueScheduler);
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        fixture = TestBed.createComponent(CreateTenantComponent);
        component = fixture.componentInstance;
        utilService = TestBed.inject(UtilService);
        router = TestBed.inject(Router);
        wizardService = TestBed.inject(WizardService);
        sessionStorageService = TestBed.inject(SessionStorageService);
        modalService = TestBed.inject(NgbModal);
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit()', () => {
        it('runs init logic', () => {
            spyOn(component, 'getExistingValues');
            component.ngOnInit();
            expect(component.getExistingValues).toHaveBeenCalled();
        });
    });

    describe('getExistingValues()', () => {
        it('gets values', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.TenantInfo, JSON.stringify(newTeam));
            component.getExistingValues();
            expect(component.createTenantForm.value.title).toEqual('test');
        });

        it('does not set values if not nothing is saved', () => {
            utilService.removeFromLocalStorage(LocalStorageKeys.TenantInfo);
            component.getExistingValues();
            expect(component.createTenantForm.value.title).not.toEqual('test');
        });

        it('does not set profileInfo if local storage is empty', () => {
            component.profileInfo = { firstName: 'joe' };
            utilService.removeFromLocalStorage(LocalStorageKeys.ProfileInfo);
            component.getExistingValues();
            expect(component.profileInfo).toEqual({ firstName: 'joe' });
        });

        it('should update profile info', () => {
            spyOn(utilService, 'getFromLocalStorage').and.returnValue(JSON.stringify({ name: 'abc', title: 'abc', id: 'abc' }));
            utilService.saveToLocalStorage(LocalStorageKeys.TenantInfo, JSON.stringify(newTeam));
            component.getExistingValues();
            expect(component.profileInfo).toEqual(({ name: 'abc', title: 'abc', id: 'abc' } as unknown) as User);
            expect(component.createTenantForm.value.title).toEqual('abc');
        });
    });

    describe('save()', () => {
        it('saves to local storage on component save method', async () => {
            spyOn(utilService, 'saveToLocalStorage').and.callThrough();
            utilService.removeFromLocalStorage(LocalStorageKeys.TenantInfo);
            sessionStorageService.setItem(LocalStorageKeys.TenantInfo, JSON.stringify(newTeam));
            component.getExistingValues();
            component.save();
            expect(utilService.saveToLocalStorage).toHaveBeenCalledWith(LocalStorageKeys.TenantInfo, JSON.stringify(newTeam));
        });
    });

    describe('goToPreviousStep()', () => {
        it('should go to next step', () => {
            spyOn(router, 'navigate').and.stub();
            spyOn(component, 'save').and.stub();
            component.goToPreviousStep();
            expect(router.navigate).toHaveBeenCalled();
            expect(component.save).toHaveBeenCalled();
        });
    });

    xdescribe('createTeam()', () => {
        beforeEach(() => {
            component.profileInfo = profileInfo;
            component.createTenantForm.controls.id.setValue(tenantInfo.id);
            component.createTenantForm.controls.title.setValue(tenantInfo.title);
        });

        it('should do nothing if there is no tenant id', () => {
            spyOn(utilService, 'saveToLocalStorage').and.stub();
            spyOn(wizardService, 'addTenant').and.returnValue(of({ id: 'tenantId' }));
            spyOn(router, 'navigate').and.stub();

            component.createTenantForm.setValue({ title: '', id: '' });
            component.createTeam();
            expect(utilService.saveToLocalStorage).not.toHaveBeenCalledWith('tenantInfo', '{"title":"ncats","id":"ncats-1"}');
            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should save to local storage with expected values then update profile and then navigate to the next step', () => {
            spyOn(wizardService, 'addTenant').and.returnValue(of({ id: 'tenantId' }));
            spyOn(utilService, 'saveToLocalStorage').and.stub();
            spyOn(wizardService, 'updateSelfProfile').and.returnValue(of(null));
            spyOn(router, 'navigate').and.stub();

            component.createTeam();

            expect(utilService.saveToLocalStorage).toHaveBeenCalledWith('tenantInfo', '{"title":"ncats","id":"ncats-1"}');
            expect(wizardService.updateSelfProfile).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalled();
        });

        it('should display id uniqueness validation error if wizardService returns already exists error and resets after id is changed', () => {
            const error = { error: { error: { errorCode: MessageErrorCode.TEAM_ALREADY_EXISTS } } };
            spyOn(wizardService, 'addTenant').and.returnValue(throwError(error));

            const idFormControl = component.createTenantForm.controls.id;

            component.createTeam();
            expect(idFormControl.hasError('exists')).toBe(true);
        });

        xit('should display alert if wizardService returns 422 error', () => {
            spyOn(wizardService, 'addTenant').and.returnValue(throwError({ error: { error: { statusCode: 422 } } }));
            spyOn(modalService, 'open').and.stub();

            component.createTeam();
            expect(modalService.open).toHaveBeenCalled();
        });

        xit('should display alert if wizardService returns 500 error', async () => {
            spyOn(wizardService, 'addTenant').and.returnValue(throwError({ error: { error: { statusCode: 500 } } }));
            spyOn(modalService, 'open').and.stub();

            component.createTeam();
            expect(modalService.open).toHaveBeenCalled();
        });

        it('should reset exists validation after id is changed', () => {
            component.createTenantForm.controls.id.setErrors({ exists: true });
            component.resetUniqueValidation();

            expect(component.createTenantForm.controls.id.hasError('exists')).toBe(false);
        });
    });

    describe('slugify()', () => {
        it('should set short name field to slugified version of team name', () => {
            component.createTenantForm.setValue({
                id: '',
                title: 'NCATS Team',
            });
            component.slugifyInput();
            expect(component.createTenantForm.controls.id.value).toEqual('ncats-team');
        });
    });
});
