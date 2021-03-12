import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
    type Example = { k: string } | string;
    let component: BreadcrumbsComponent<Example>;
    let fixture: ComponentFixture<BreadcrumbsComponent<Example>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BreadcrumbsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<BreadcrumbsComponent<Example>>(BreadcrumbsComponent);
        component = fixture.componentInstance;
        component.paths = ['a', 'b', 'c'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('renderPaths()', () => {
        it('sets key function', () => {
            const vals = [{ k: 'a' }, { k: 'b' }, { k: 'c' }];
            component.paths = vals;
            component.key = 'k';
            component.ngOnInit();
            let val;
            component.selected.subscribe(x => (val = x));
            component.navigate(0);
            const key = vals[0].k;
            expect(key).toEqual(val);
        });

        it('sets display function', () => {
            const vals = [{ k: 'a' }, { k: 'b' }, { k: 'c' }];
            component.paths = vals;
            component.display = 'k';
            component.ngOnInit();
            expect(component.displayedPaths[0]).toEqual('a');
        });
    });

    describe('ngOnChanges()', () => {
        it('should call update internal settings', () => {
            const vals = [
                { k: 'a', i: 'i1' },
                { k: 'b', i: 'i2' },
                { k: 'c', i: 'i3' },
            ];
            component.paths = vals;
            component.key = 'k';
            component.ngOnInit();
            let val;
            component.selected.subscribe(x => (val = x));
            component.navigate(0);
            const key = vals[0].k;
            expect(key).toEqual(val);

            // new key
            component.key = 'i';
            component.ngOnChanges();
            let val2;
            component.selected.subscribe(x => (val2 = x));
            component.navigate(0);
            const key2 = vals[0].i;
            expect(key2).toEqual(val2);
        });
    });

    describe('navigate()', () => {
        it('should emit event', () => {
            let res;
            component.selected.subscribe(x => (res = x));
            component.navigate(1);
            expect(res).toEqual('b');
        });
    });
});
