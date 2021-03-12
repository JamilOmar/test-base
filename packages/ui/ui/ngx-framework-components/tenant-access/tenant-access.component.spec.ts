import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WizardService } from '../services/wizard.service';
import { TenantAccessComponent } from './tenant-access.component';

describe('TenantAccessComponent', () => {
    let component: TenantAccessComponent;
    let fixture: ComponentFixture<TenantAccessComponent>;
    let wizardService: WizardService;

    describe('With route provided', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [TenantAccessComponent],
                providers: [
                    {
                        provide: WizardService,
                        useValue: {
                            setBaseRoute(): void {},
                            startNewTenantProcess(baseUrl): void {},
                        },
                    },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: { data: { baseRoute: '/route' } },
                        },
                    },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TenantAccessComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            wizardService = TestBed.inject(WizardService);
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        describe('ngOnInit()', () => {
            it('should set baseRoute in wizard service', () => {
                spyOn(wizardService, 'setBaseRoute');
                component.ngOnInit();
                expect(wizardService.setBaseRoute).toHaveBeenCalledWith('/route');
            });
        });
    });

    describe('Without route provided', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [TenantAccessComponent],
                providers: [
                    {
                        provide: WizardService,
                        useValue: {
                            setBaseRoute(): void {},
                            startNewTenantProcess(baseUrl): void {},
                        },
                    },
                    {
                        provide: ActivatedRoute,
                        useValue: {
                            snapshot: { data: {} },
                        },
                    },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            }).compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(TenantAccessComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            wizardService = TestBed.inject(WizardService);
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        describe('ngOnInit()', () => {
            it('should set baseRoute in wizard service', () => {
                spyOn(wizardService, 'setBaseRoute');
                component.ngOnInit();
                expect(wizardService.setBaseRoute).toHaveBeenCalledWith('/');
            });
        });
    });
});
