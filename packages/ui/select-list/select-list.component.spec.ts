import { QueryList, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LsTemplateDirective } from '@labshare/base-ui/template';
import { TemplateType, SelectListComponent } from './select-list.component';

describe('SelectListComponent', () => {
    let component: SelectListComponent<string>;
    let fixture: ComponentFixture<SelectListComponent<string>>;

    const templates = ([
        {
            getType() {
                return TemplateType.item;
            },
            template: {} as TemplateRef<unknown>,
            type: 'any',
            name: 'any',
        },
    ] as unknown) as QueryList<LsTemplateDirective>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<SelectListComponent<string>>(SelectListComponent);
        component = fixture.componentInstance;
        component.value = ['a', 'b', 'c'];
        component.selection = ['a'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngAfterContentInit()', () => {
        it('should parse templates', () => {
            component.templates = templates;
            component.ngAfterContentInit();
            expect(component.itemTemplate).toBeTruthy();
        });

        it('should set default templates', () => {
            component.templates = ([
                {
                    getType() {
                        return 'default';
                    },
                    template: {} as TemplateRef<unknown>,
                },
            ] as unknown) as QueryList<LsTemplateDirective>;
            component.ngAfterContentInit();
            expect(component.itemTemplate).toBeTruthy();
        });
    });

    describe('ngAfterViewInit()', () => {
        it('scrolls to the item', () => {
            component.selection = ['c'];
            const parent = component.listParent.nativeElement;
            const oldOffsettop = parent.offsetTop;
            const activeChild = parent.children[0];
            component.ngAfterViewInit();
            expect(parent.scrollTop).toEqual(activeChild.offsetTop - oldOffsettop);
        });

        it('does not scroll when no selection', () => {
            component.selection = [];
            const parent = component.listParent.nativeElement;
            component.ngAfterViewInit();
            expect(parent.scrollTop).toEqual(0);
        });

        it('does not scroll when selection not found', () => {
            component.selection = ['d'];
            const parent = component.listParent.nativeElement;
            component.ngAfterViewInit();
            expect(parent.scrollTop).toEqual(0);
        });
    });

    describe('onItemClick()', () => {
        it('sets selection', () => {
            component.onItemClick(({ metaKey: false } as unknown) as MouseEvent, 'a', 0);
            expect(component.selection).toEqual(['a']);
        });

        it('unselects selection', () => {
            component.onItemClick(({ metaKey: false } as unknown) as MouseEvent, 'a', 0);
            expect(component.selection).toEqual(['a']);
            component.onItemClick(({ metaKey: true } as unknown) as MouseEvent, 'a', 0);
            expect(component.selection).toEqual([]);
        });

        it('sets multi selection', () => {
            component.onItemClick(({ metaKey: false } as unknown) as MouseEvent, 'a', 0);
            component.onItemClick(({ metaKey: true } as unknown) as MouseEvent, 'b', 1);
            expect(component.selection).toEqual(['a', 'b']);
        });

        it('sets selection with meta key pressed', () => {
            component.selection = undefined;
            component.onItemClick(({ metaKey: true } as unknown) as MouseEvent, 'b', 1);
            expect(component.selection).toEqual(['b']);
        });

        it('changes selection', () => {
            component.onItemClick(({ metaKey: false } as unknown) as MouseEvent, 'a', 0);
            component.onItemClick(({ metaKey: false } as unknown) as MouseEvent, 'b', 1);
            expect(component.selection).toEqual(['b']);
        });
    });
});
