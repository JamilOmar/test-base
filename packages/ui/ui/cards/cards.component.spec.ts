import { QueryList, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LsTemplateDirective } from '@labshare/base-ui/template';

import { CardsComponent, CardTemplateType } from './cards.component';

describe('CardsComponent', () => {
    let component: CardsComponent<string>;
    let fixture: ComponentFixture<CardsComponent<string>>;

    const templates = ([
        {
            getType() {
                return CardTemplateType.item;
            },
            template: {} as TemplateRef<unknown>,
            type: 'any',
            name: 'any',
        },
    ] as unknown) as QueryList<LsTemplateDirective>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<CardsComponent<string>>(CardsComponent);
        component = fixture.componentInstance;
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

    describe('onDoubleClick()', () => {
        it('sends event', () => {
            let s;
            component.doubleClick.subscribe(x => (s = x));
            component.onDoubleClick('a');
            expect(s).toEqual('a');
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
