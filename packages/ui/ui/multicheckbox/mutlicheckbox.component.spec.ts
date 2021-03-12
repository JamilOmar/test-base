import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MutlicheckboxComponent } from './mutlicheckbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryList, TemplateRef } from '@angular/core';
import { LsTemplateDirective } from '@labshare/base-ui/template';

describe('MutlicheckboxComponent', () => {
    interface Example {
        name: string;
        id: number;
    }
    let component: MutlicheckboxComponent<string | number | Example>;
    let fixture: ComponentFixture<MutlicheckboxComponent<string | number | Example>>;
    const options = ['a', 'b', 'c'];
    const model = ['a'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule],
            declarations: [MutlicheckboxComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<MutlicheckboxComponent<string | number | Example>>(MutlicheckboxComponent);
        component = fixture.componentInstance;
        component.options = options;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.selected.length).toEqual(options.length);
    });

    describe('should call to ngAfterContentInit() hook', () => {
        it('should set up custom templates', () => {
            component.templates = ([
                {
                    getType() {
                        return 'item';
                    },
                    template: ({ elementRef: 'customTemplate ' } as unknown) as TemplateRef<unknown>,
                },
            ] as unknown) as QueryList<LsTemplateDirective<unknown>>;
            component.ngAfterContentInit();
            expect(component.itemTemplate).toEqual(({
                elementRef: 'customTemplate ',
            } as unknown) as TemplateRef<unknown>);
        });
    });

    describe('onModelTouched()', () => {
        it('should not throw error', () => {
            expect(() => {
                component.onModelTouched([123]);
            }).not.toThrowError();
        });
    });

    describe('writeValue()', () => {
        it('should set value', () => {
            component.writeValue(model);
            expect(component.selected).toEqual([true, false, false]);
        });

        it('should not set value', () => {
            component.writeValue(null);
            expect(component.selected).toEqual([false, false, false]);
        });

        it('should throw an error when incoming value is not an array', () => {
            let error;
            try {
                component.writeValue((123 as unknown) as string[]);
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });

        it('should set value for when options are objects and key is defined', () => {
            component.options = [
                { name: 'Alice', id: 1111 },
                { name: 'Bob', id: 222 },
                { name: 'Charlie', id: 33 },
            ];
            component.key = 'id';
            component.writeValue([222]);
            expect(component.selected).toEqual([false, true, false]);
        });
    });

    describe('registerOnChange()', () => {
        it('should register onChange', () => {
            const foo = { log: val => {} };
            spyOn(foo, 'log');
            const x = val => foo.log(val);
            component.registerOnChange((x as unknown) as () => {});
            component.onModelChange([123]);
            expect(foo.log).toHaveBeenCalled();
        });
    });

    describe('registerOnTouched()', () => {
        it('should register onTouch', () => {
            const foo = { log: val => {} };
            spyOn(foo, 'log');
            const x = val => foo.log(val);
            component.registerOnTouched((x as unknown) as () => {});
            component.onModelTouched([123]);
            expect(foo.log).toHaveBeenCalled();
        });
    });

    describe('setDisabledState()', () => {
        it('should set disalbed', () => {
            component.setDisabledState(true);
            expect(component.disabled).toBeTruthy();
        });

        it('should set enabled', () => {
            component.setDisabledState(false);
            expect(component.disabled).toBeFalsy();
        });
    });

    describe('validate()', () => {
        it('should call validate', () => {
            expect(component.validate()).toBeDefined();
        });

        it('should return errors', () => {
            component.required = true;
            const mdl = [];
            component.writeValue(mdl);
            const res = component.validate();
            expect(res.required).toBeTruthy();
        });

        it('should not return errors when component is not required', () => {
            component.required = false;
            const mdl = [];
            component.writeValue(mdl);
            const res = component.validate();
            expect(res).toBeFalsy();
        });

        it('should not return required error', () => {
            const mdl = ['one'];

            component.writeValue(mdl);
            const res = component.validate();
            expect(res).toBeFalsy();
        });
    });
});
