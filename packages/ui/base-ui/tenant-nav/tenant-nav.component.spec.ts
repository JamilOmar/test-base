import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantNavComponent } from './tenant-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { EventService, AuthService, EventKeys as CoreEventKeys } from '@labshare/ngx-core-services';
import { ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { DynamicComponent } from '../dynamic-component/dynamic.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TenantNavEventKeys } from './tenant-nav.event-keys';
import { SearchPipe } from './search.pipe';
import { FormsModule } from '@angular/forms';
import { App, Tenant } from './tenant-nav.types';

const tenants = [
    {
        id: 'a',
        icon: '/logoA',
        text: 'aText',
    },
    {
        id: 'b',
        icon: '/logoB',
        text: 'bText',
    },
    {
        id: 'c',
        icon: '/logoC',
        text: 'aText',
    },
] as Tenant[];

describe('TenantNavComponent', () => {
    describe('with empty data route params', () => {
        let fixture: ComponentFixture<TenantNavComponent>;
        let eventService: EventService;
        let component: TenantNavComponent;
        let testBedService: AuthService;
        let componentService: AuthService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, RouterTestingModule.withRoutes([])],
                declarations: [TenantNavComponent, DynamicComponent, SearchPipe],
                providers: [AuthService, { provide: ActivatedRoute, useValue: { snapshot: { data: {} } } }],
            }).compileComponents();
        }));

        beforeEach(() => {
            eventService = TestBed.inject(EventService);
            eventService.get(TenantNavEventKeys.TenantList).next(tenants);
            fixture = TestBed.createComponent(TenantNavComponent);
            component = fixture.componentInstance;
            testBedService = TestBed.inject(AuthService);
            componentService = fixture.debugElement.injector.get(AuthService);
            fixture.detectChanges();
        });

        it('should set default member values', () => {
            expect(component.links).toEqual([]);
        });
    });
});

describe('TenantNavComponent', () => {
    let eventService: EventService;
    describe('without route params', () => {
        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([])],
                declarations: [TenantNavComponent, DynamicComponent, SearchPipe],
                providers: [AuthService, { provide: ActivatedRoute, useValue: { snapshot: {} } }],
            }).compileComponents();
        }));

        beforeEach(() => {
            eventService = TestBed.inject(EventService);
            eventService.get(TenantNavEventKeys.TenantList).next(tenants);
        });

        it('should set default member values', () => {
            const component = TestBed.createComponent(TenantNavComponent).componentInstance;
            expect(component.links).toEqual([]);
        });
    });
});

describe('TenantNavComponent', () => {
    let component: TenantNavComponent;
    let fixture: ComponentFixture<TenantNavComponent>;
    let eventService: EventService;

    const links = [
        {
            id: '1',
            route: '/labshare',
            text: 'Pages',
            click: 'tenant-switch',
            icon: 'icon-Pages',
        },
    ];

    const routeStub = {
        snapshot: {
            data: {
                links,
            },
        },
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([])],
            declarations: [TenantNavComponent, DynamicComponent, UserProfileComponent, SearchPipe],
            providers: [AuthService, { provide: ActivatedRoute, useValue: routeStub }],
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [UserProfileComponent],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        eventService = TestBed.inject(EventService);
        eventService.get(TenantNavEventKeys.TenantList).next(tenants);
        fixture = TestBed.createComponent(TenantNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('showTenant()', () => {
        it('should set boolen values to show tenant menu', () => {
            component.showTenant(true);
            expect(component.menuExpanded).toEqual(true);
            expect(component.showTenantMenu).toEqual(true);
        });

        it('should reset query when showTenant is called with "false"', () => {
            component.query = 'abc';
            component.showTenant(false);
            expect(component.query).toEqual('');
        });
    });

    describe('selectTenant()', () => {
        it('should broadcast new tenant value', () => {
            component.selectTenant({ text: 'two' } as Tenant);
            expect(eventService.get(CoreEventKeys.SwitchTenant).value).toEqual({ text: 'two' });
        });
    });

    describe('selectApp()', () => {
        it('should broadcast new app value', () => {
            component.selectApp({ link: 'two' } as App);
            expect(eventService.get(TenantNavEventKeys.OnSelectApp).value).toEqual({ link: 'two' });
        });
    });

    describe('viewAllTenants()', () => {
        it('should broadcast new tenant value', () => {
            component.viewAllTenants();
            expect(eventService.get(TenantNavEventKeys.ViewAllTenants).value).toEqual(true);
        });
    });

    describe('toggle()', () => {
        it('should toggle off visibility params', () => {
            component.menuExpanded = true;
            component.query = 'abc';
            component.showTenantMenu = true;
            component.toggle();
            expect(component.menuExpanded).toBeFalsy();
            expect(component.showTenantMenu).toBeFalsy();
            expect(component.query).toBeFalsy();
        });

        it('should toggle on visibility params', () => {
            component.menuExpanded = false;
            component.toggle();
            expect(component.menuExpanded).toBeTruthy();
        });
    });
});
