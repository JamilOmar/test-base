import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService, EventService, NgxCoreServicesModule } from '@labshare/ngx-core-services';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './welcome.component';
import { WizardService } from '../../../services/wizard.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class FakeAuthService {
    public endSession() {}
    public login() {}
}

describe('WelcomeComponent', () => {
    let fixture: ComponentFixture<WelcomeComponent>;
    let component: WelcomeComponent;
    let wizardService: WizardService;
    let eventService: EventService;
    let authService: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgxCoreServicesModule, ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
            declarations: [WelcomeComponent],
            providers: [
                {
                    provide: AuthService,
                    useClass: FakeAuthService,
                },
                {
                    provide: WizardService,
                    useValue: {
                        startNewTenantProcess(baseUrl): void {},
                        accessExistingTenant(baseUrl): void {},
                    },
                },
                { provide: EventService, useClass: EventService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });

        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        wizardService = TestBed.inject(WizardService);
        eventService = TestBed.inject(EventService);
        authService = TestBed.inject(AuthService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('startNewTenantProcess()', () => {
        it('should start the tenant process', () => {
            spyOn(wizardService, 'startNewTenantProcess');
            component.startNewTenantProcess();
            expect(wizardService.startNewTenantProcess).toHaveBeenCalled();
        });
    });

    describe('ngOnInit()', () => {
        it('should end auth session', () => {
            spyOn(authService, 'endSession').and.stub();
            component.ngOnInit();
            expect(authService.endSession).toHaveBeenCalled();
        });
    });

    it('should call goToDashboardWelcome() and accessExistingTenant methods', () => {
        spyOn(wizardService, 'accessExistingTenant');
        component.goToDashboardWelcome();
        expect(wizardService.accessExistingTenant).toHaveBeenCalled();
    });
});
