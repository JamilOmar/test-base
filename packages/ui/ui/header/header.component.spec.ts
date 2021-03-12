import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@labshare/ngx-core-services';
import { ThemeModule } from '../theme/theme.module';
import { HeaderConfig, HeaderEventKeys } from './header.event-keys';

const routeStub = {
    snapshot: {
        data: {
            config: {
                text: 'test',
            },
        },
    },
};

describe('HeaderComponent', () => {
    let injector;
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let eventService: EventService;
    let activatedRoute: ActivatedRoute;

    function configureTestingModule() {
        TestBed.configureTestingModule({
            imports: [CommonModule, RouterTestingModule.withRoutes([]), ThemeModule],
            declarations: [],
            providers: [
                { provide: ActivatedRoute, useValue: routeStub },
                { provide: EventService, useClass: EventService },
            ],
        }).compileComponents();
    }

    function setTestBedValues() {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;

        injector = getTestBed();
        eventService = injector.get(EventService);
        activatedRoute = injector.get(ActivatedRoute);

        fixture.detectChanges();
    }

    beforeEach(() => {
        configureTestingModule();
        setTestBedValues();
    });

    describe('constructor logic and ngOnInit()', () => {
        it('should set header txt through config obj', () => {
            expect(component.config).toEqual(routeStub.snapshot.data.config as HeaderConfig);
        });

        it('should set header config property to empty string if there is no router config', async(() => {
            TestBed.resetTestingModule();
            configureTestingModule();
            TestBed.overrideProvider(ActivatedRoute, {
                useValue: {
                    snapshot: {
                        data: {},
                    },
                },
            });
            setTestBedValues();
            expect(component.config.text).toEqual('');
        }));

        it('should update the Title config obj', () => {
            eventService.get(HeaderEventKeys.Title).next('three');
            expect(component.config).toEqual({ text: 'three' } as HeaderConfig);
        });
    });

    describe('clickItem()', () => {
        it('should broadcast new clicked header item', () => {
            const clickItem = { click: 'testId' };
            component.clickItem(clickItem);
            expect(eventService.get(clickItem.click).value).toEqual(clickItem);
        });
    });
});
