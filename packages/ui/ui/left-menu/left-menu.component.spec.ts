import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { LeftNavComponent } from './left-menu.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@labshare/ngx-core-services';

const routeStub = {
    snapshot: {
        data: {
            items: [
                {
                    id: 'testId',
                    text: 'test',
                    icon: 'icon-lsi-storage',
                },
            ],
        },
    },
};

describe('LeftNavComponent', () => {
    let component: LeftNavComponent;
    let fixture: ComponentFixture<LeftNavComponent>;
    const routeStub1 = {
        snapshot: {},
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, RouterTestingModule.withRoutes([])],
            declarations: [LeftNavComponent],
            providers: [
                { provide: ActivatedRoute, useValue: routeStub1 },
                { provide: EventService, useClass: EventService },
            ],
        });
        TestBed.overrideProvider(ActivatedRoute, { useValue: routeStub1 });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftNavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not set items', () => {
        expect(component.items.length).toEqual(0);
    });
});

describe('LeftNavComponent', () => {
    let injector;
    let component: LeftNavComponent;
    let fixture: ComponentFixture<LeftNavComponent>;
    let eventService: EventService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, RouterTestingModule.withRoutes([])],
            declarations: [LeftNavComponent],
            providers: [
                { provide: ActivatedRoute, useValue: routeStub },
                { provide: EventService, useClass: EventService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeftNavComponent);
        component = fixture.componentInstance;
        injector = getTestBed();
        eventService = injector.get(EventService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
