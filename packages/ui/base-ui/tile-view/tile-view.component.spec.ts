import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileViewComponent } from './tile-view.component';
import { LsTemplateDirective } from '@labshare/base-ui/template';

describe('TileViewComponent', () => {
    interface Example {
        id: string;
    }

    let component: TileViewComponent<Example>;
    let fixture: ComponentFixture<TileViewComponent<Example>>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            providers: [],
            declarations: [TileViewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent<TileViewComponent<Example>>(TileViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('ngAfterContentInit()', () => {
        it('should set up templates', () => {
            component.templates = ([
                {
                    getType() {
                        return 'item';
                    },
                    template: ({ elementRef: '123 ' } as unknown) as TemplateRef<LsTemplateDirective>,
                },
            ] as unknown) as QueryList<LsTemplateDirective>;
            component.ngAfterContentInit();
            expect(component.itemTemplate).toEqual(({
                elementRef: '123 ',
            } as unknown) as TemplateRef<unknown>);
        });
    });

    describe('items()', () => {
        it('should set up items', () => {
            component.selectedIndex = 123;
            component.selection = { id: 'a' };
            component.items = [{ id: 'a' }];
            expect(component.selection).toEqual(null);
            expect(component.selectedIndex).toEqual(-1);
            expect(component.localItems.length).toEqual(1);
        });
    });

    describe('select()', () => {
        it('should select  items', () => {
            component.items = [{ id: 'a' }, { id: 'b' }];
            component.selectedIndex = 123;
            component.selection = { id: 'a' };
            component.click(1);
            expect(component.selection.id).toEqual('b');
            expect(component.selectedIndex).toEqual(1);
        });
    });
});
