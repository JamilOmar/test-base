import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DualSelectComponent } from './dualselect.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('DualSelectComponent', () => {
    interface Example {
        id: string;
    }
    let component: DualSelectComponent<string | Example>;
    let fixture: ComponentFixture<DualSelectComponent<string | Example>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, FormsModule],
            declarations: [DualSelectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent<DualSelectComponent<string | Example>>(DualSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('checkButtons()', () => {
        it('disables all buttons', () => {
            component.selection = [];
            component.options = [];
            component.ngOnInit();
            expect(component.disabledAdd).toEqual(true);
            expect(component.disabledDown).toEqual(true);
            expect(component.disabledUp).toEqual(true);
            expect(component.disabledRemove).toEqual(true);
        });

        it('enables Add button', () => {
            component.selection = [];
            component.options = ['a', 'b', 'c', 'd'];
            component.selectedLeft = ['a'];
            component.checkButtons();
            expect(component.disabledAdd).toEqual(false);
        });

        it('enables Add button', () => {
            component.selection = ['a'];
            component.options = ['b', 'c', 'd'];
            component.selectedRight = ['a'];
            component.checkButtons();
            expect(component.disabledRemove).toEqual(false);
        });

        it('enables Up button when selected option is not first', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b'];
            component.checkButtons();
            expect(component.disabledUp).toEqual(false);
        });

        it('disables Up button when first option is selected', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['a', 'c'];
            component.checkButtons();
            expect(component.disabledUp).toEqual(true);
        });

        it('enables Down button when one of the selected options is not last', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['a', 'c'];
            component.checkButtons();
            expect(component.disabledDown).toEqual(false);
        });

        it('disables Down button when one of the selected options is last', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['a', 'c', 'd'];
            component.checkButtons();
            expect(component.disabledDown).toEqual(true);
        });
    });

    describe('shiftUp()', () => {
        it('shifts options up', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b', 'c'];
            component.shiftUp();
            expect(component.selection).toEqual(['b', 'c', 'a', 'd']);
        });

        it('shifts object options up by display', () => {
            component.display = 'id';
            component.ngOnInit();
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.shiftUp();
            expect(component.selection).toEqual([{ id: 'b' }, { id: 'c' }, { id: 'a' }, { id: 'd' }]);
        });

        it('shifts object options up by key', () => {
            component.display = 'id';
            component.key = 'id';
            component.ngOnInit();
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.shiftUp();
            expect(component.selection).toEqual([{ id: 'b' }, { id: 'c' }, { id: 'a' }, { id: 'd' }]);
        });
    });

    describe('shiftDown()', () => {
        it('shifts options down', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b', 'c'];
            component.shiftDown();
            expect(component.selection).toEqual(['a', 'd', 'b', 'c']);
        });

        it('shifts object options down by display', () => {
            component.display = 'id';
            component.ngOnInit();
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.shiftDown();
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'd' }, { id: 'b' }, { id: 'c' }]);
        });

        it('shifts object options down by key', () => {
            component.display = 'id';
            component.key = 'id';
            component.ngOnInit();
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.shiftDown();
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'd' }, { id: 'b' }, { id: 'c' }]);
        });
    });

    describe('add()', () => {
        it('adds items to selection', () => {
            component.options = ['a', 'b', 'c', 'd'];
            component.selectedLeft = ['b', 'c'];
            component.selection = [];
            component.ngOnInit();
            component.add();
            expect(component.selection).toEqual(['b', 'c']);
            expect(component.allOptions).toEqual(['a', 'd']);
            expect(component.selectedLeft).toEqual([]);
        });

        it('adds items to selection by display', () => {
            component.options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedLeft = [{ id: 'b' }, { id: 'c' }];
            component.selection = [];
            component.display = 'id';
            component.ngOnInit();
            component.add();
            expect(component.selection).toEqual([{ id: 'b' }, { id: 'c' }]);
            expect(component.allOptions).toEqual([{ id: 'a' }, { id: 'd' }]);
            expect(component.selectedLeft).toEqual([]);
        });

        it('adds items to selection by display', () => {
            component.options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedLeft = [{ id: 'b' }, { id: 'c' }];
            component.selection = [];
            component.display = 'id';
            component.key = 'id';
            component.ngOnInit();
            component.add();
            expect(component.selection).toEqual([{ id: 'b' }, { id: 'c' }]);
            expect(component.allOptions).toEqual([{ id: 'a' }, { id: 'd' }]);
            expect(component.selectedLeft).toEqual([]);
        });
    });

    describe('addAll()', () => {
        it('adds all items to selection', () => {
            component.options = ['a', 'b', 'c', 'd'];
            component.selectedLeft = ['b', 'c'];
            component.selection = [];
            component.ngOnInit();
            component.addAll();
            expect(component.selection).toEqual(['a', 'b', 'c', 'd']);
            expect(component.allOptions).toEqual([]);
            expect(component.disabledAddAll).toEqual(true);
        });
    });

    describe('remove()', () => {
        it('removes items to selection', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b', 'c'];
            component.allOptions = [];
            component.ngOnInit();
            component.remove();
            expect(component.allOptions).toEqual(['b', 'c']);
            expect(component.selection).toEqual(['a', 'd']);
            expect(component.selectedRight).toEqual([]);
        });

        it('removes items to selection by display', () => {
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.allOptions = [];
            component.display = 'id';
            component.ngOnInit();
            component.remove();
            expect(component.allOptions).toEqual([{ id: 'b' }, { id: 'c' }]);
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'd' }]);
            expect(component.selectedRight).toEqual([]);
        });

        it('removes items to selection by display', () => {
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedRight = [{ id: 'b' }, { id: 'c' }];
            component.allOptions = [];
            component.display = 'id';
            component.key = 'id';
            component.ngOnInit();
            component.remove();
            expect(component.allOptions).toEqual([{ id: 'b' }, { id: 'c' }]);
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'd' }]);
            expect(component.selectedRight).toEqual([]);
        });
    });

    describe('removeAll()', () => {
        it('removes all items from selection', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b', 'c'];
            component.allOptions = [];
            component.ngOnInit();
            component.removeAll();
            expect(component.allOptions).toEqual(['a', 'b', 'c', 'd']);
            expect(component.selection).toEqual([]);
            expect(component.disabledRemoveAll).toEqual(true);
        });
    });

    describe('writeValue()', () => {
        it('should set value', () => {
            component.options = ['a', 'b', 'c', 'd'];
            component.selectedLeft = ['a', 'b'];
            component.selection = [];
            component.ngOnInit();
            component.writeValue(['a', 'd']);
            expect(component.selection).toEqual(['a', 'd']);
            expect(component.allOptions).toEqual(['b', 'c']);
            expect(component.selectedLeft).toEqual([]);
            expect(component.selectedRight).toEqual([]);
        });

        it('should set value by display', () => {
            component.options = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.selectedLeft = [{ id: 'b' }, { id: 'c' }];
            component.selection = [];
            component.display = 'id';
            component.ngOnInit();
            component.writeValue([{ id: 'a' }, { id: 'b' }]);
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'b' }]);
            expect(component.allOptions).toEqual([{ id: 'c' }, { id: 'd' }]);
            expect(component.selectedLeft).toEqual([]);
            expect(component.selectedRight).toEqual([]);
        });

        it('should set value by key', () => {
            component.options = [];
            component.selectedLeft = [{ id: 'b' }, { id: 'c' }];
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.display = 'id';
            component.key = 'id';
            component.ngOnInit();
            component.writeValue(['a', 'b']);
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'b' }]);
            expect(component.allOptions).toEqual([{ id: 'c' }, { id: 'd' }]);
            expect(component.selectedLeft).toEqual([]);
            expect(component.selectedRight).toEqual([]);
        });

        it('should not set value', () => {
            component.selection = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
            component.writeValue(null);
            expect(component.selection).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]);
        });

        it('should throw an error when incoming value is not an array', () => {
            let error;
            try {
                component.writeValue((123 as unknown) as Example[]);
            } catch (e) {
                error = e;
            }
            expect(error).toBeDefined();
        });
    });

    describe('registerOnChange()', () => {
        it('should register onChange', () => {
            component.options = ['a', 'b', 'c', 'd'];
            component.selectedLeft = ['a', 'b'];
            component.selection = [];
            component.ngOnInit();
            component.writeValue(['a', 'd']);
            const foo = { log: () => ({}) };
            spyOn(foo, 'log');
            component.registerOnChange(foo.log);
            component.registerOnTouched(foo.log);
            component.addAll();
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

    describe('ngOnChanges()', () => {
        it('resets control and adds new options', () => {
            component.selection = ['a', 'b', 'c', 'd'];
            component.selectedRight = ['b', 'c'];
            component.allOptions = [];
            component.options = ['a', 'a1'];
            component.ngOnChanges();
            expect(component.allOptions).toEqual(['a', 'a1']);
            expect(component.selection).toEqual([]);
            expect(component.disabledRemoveAll).toEqual(true);
        });
    });
});
