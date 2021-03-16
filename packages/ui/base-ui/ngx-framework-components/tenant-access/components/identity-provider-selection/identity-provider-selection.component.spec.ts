import { ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { UtilService } from '../../../services/util.service';
import { IdentityProviderSelectionComponent } from './identity-provider-selection.component';
import { LocalStorageKeys } from '../../../shared/constants';
import { IdentityProvider } from '../../../shared/types';
import { NgxCoreServicesModule, ConfigService, AuthService, SessionStorageService, WindowService } from '@labshare/ngx-core-services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { WizardService } from '../../../services/wizard.service';
import { MulticheckboxModule } from '@labshare/base-ui/multicheckbox';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockConfigService {
    get() {
        return '/';
    }
}

describe('IdentityProviderSelectionComponent', () => {
    let fixture: ComponentFixture<IdentityProviderSelectionComponent>;
    let component: IdentityProviderSelectionComponent;
    let utilService: UtilService;
    let router: Router;
    let wizardService: WizardService;
    let identityProviderDefaultInfo: IdentityProvider[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]), MulticheckboxModule],
            declarations: [IdentityProviderSelectionComponent],
            providers: [
                UtilService,
                SessionStorageService,
                WindowService,
                AuthService,
                { provide: ConfigService, useClass: MockConfigService },
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

        fixture = TestBed.createComponent(IdentityProviderSelectionComponent);
        component = fixture.componentInstance;
        utilService = TestBed.inject(UtilService);
        router = TestBed.inject(Router);
        wizardService = TestBed.inject(WizardService);
        identityProviderDefaultInfo = [
            {
                id: 'nih',
                type: 'NIH',
            },
            {
                id: 'yahoo',
                type: 'Yahoo',
            },
            {
                id: 'azure',
                type: 'Azure',
            },
        ];
        component.allProviders = identityProviderDefaultInfo;
    });

    afterEach(() => {
        component.ngOnDestroy();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should load all the Identity Providers form values and check the user selected ones', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.IdentityProvider, JSON.stringify([identityProviderDefaultInfo[0]]));
            spyOn(wizardService, 'getIdentityProviders').and.returnValue(of(identityProviderDefaultInfo));
            component.ngOnInit();
            expect(component.providers.value[0]).toBeTruthy();
        });

        it('does nothing if no value was stored', () => {
            utilService.removeFromLocalStorage(LocalStorageKeys.IdentityProvider);
            spyOn(wizardService, 'getIdentityProviders').and.returnValue(of(identityProviderDefaultInfo));
            component.ngOnInit();
            expect(component.providers.value[0]).toBeFalsy();
        });
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

    describe('save()', () => {
        it('should save data', () => {
            spyOn(utilService, 'saveToLocalStorage').and.callThrough();
            utilService.saveToLocalStorage(LocalStorageKeys.IdentityProvider, JSON.stringify([identityProviderDefaultInfo[0]]));
            spyOn(wizardService, 'getIdentityProviders').and.returnValue(of(identityProviderDefaultInfo));
            component.ngOnInit();
            component.providers.setValue([true, false, false]);
            component.save();
            expect(utilService.saveToLocalStorage).toHaveBeenCalled();
        });

        it('should save all the selected Identity Providers', () => {
            utilService.saveToLocalStorage(LocalStorageKeys.IdentityProvider, JSON.stringify(identityProviderDefaultInfo));
            component.ngOnInit();
            component.save();
            expect(JSON.parse(utilService.getFromLocalStorage(LocalStorageKeys.IdentityProvider))).not.toContain(identityProviderDefaultInfo[0]);
            expect(JSON.parse(utilService.getFromLocalStorage(LocalStorageKeys.IdentityProvider))).not.toContain(identityProviderDefaultInfo[1]);
        });
    });
});
