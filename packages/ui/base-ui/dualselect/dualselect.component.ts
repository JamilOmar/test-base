import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator } from '@angular/forms';

/**
 * Component for switching values between two groups.
 */
@Component({
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: DualSelectComponent,
        },
        {
            multi: true,
            provide: NG_VALIDATORS,
            useExisting: DualSelectComponent,
        },
    ],
    selector: 'ls-dualselect',
    templateUrl: './dualselect.component.html',
    styleUrls: ['./dualselect.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DualSelectComponent<T = string | number | object> implements ControlValueAccessor, Validator, OnInit, OnChanges {
    /** An array for the available values to be displayed in the groups  */
    @Input() options: T[] = [];
    /** Specify if input is required or not  */
    @Input() required = false;
    /** Specify which property of object to display. Required if options are objects  */
    @Input() display = '';
    /** Specify which property of object to return. Optional */
    @Input() key = '';

    public disabled = false;
    public selectedRight: T[] = [];
    public selectedLeft: T[] = [];
    public selection: T[] = [];
    public allOptions: T[] = [];
    public disabledUp = false;
    public disabledDown = false;
    public disabledAdd = false;
    public disabledAddAll = false;
    public disabledRemove = false;
    public disabledRemoveAll = false;

    protected getKey = (x: T): string | number => (x as unknown) as string | number;

    ngOnInit(): void {
        if (this.display) {
            this.getKey = x => x[this.display];
        }
        if (this.key) {
            this.getKey = x => x[this.key];
        }
        this.allOptions = this.options.slice();
        this.checkButtons();
    }

    ngOnChanges(): void {
        this.removeAll();
        this.allOptions = this.options.slice();
        this.checkButtons();
    }

    checkButtons() {
        this.disabledAdd = !this.selectedLeft.length;
        this.disabledAddAll = !this.allOptions || this.allOptions.length === 0;
        this.disabledRemove = !this.selectedRight.length;
        this.disabledRemoveAll = !this.selection || this.selection.length === 0;
        this.disabledUp = !this.selectedRight.length || this.getKey(this.selectedRight[0]) === this.getKey(this.selection[0]);
        this.disabledDown =
            !this.selectedRight.length ||
            this.getKey(this.selectedRight[this.selectedRight.length - 1]) === this.getKey(this.selection[this.selection.length - 1]);
    }

    private moveItems(selection: T[], source: T[], target: T[]) {
        let count = selection.length;
        while (count--) {
            const key = this.getKey(selection.shift());
            const index = source.map(x => this.getKey(x)).indexOf(key);
            const item = source.splice(index, 1).pop();
            target.push(item);
        }
        this.update();
    }

    add() {
        this.moveItems(this.selectedLeft, this.allOptions, this.selection);
    }

    addAll() {
        this.selection.push(...this.allOptions);
        this.allOptions = [];
        this.update();
    }

    remove() {
        this.moveItems(this.selectedRight, this.selection, this.allOptions);
    }

    removeAll() {
        this.allOptions.push(...this.selection);
        this.selection = [];
        this.update();
    }

    shiftUp() {
        const hash = this.selectedRight.reduce((obj, el) => {
            obj[this.getKey(el)] = true;
            return obj;
        }, {});
        for (let i = 0, l = this.selection.length; i < l; i++) {
            const key = this.getKey(this.selection[i]);
            if (hash[key]) {
                const temp = this.selection[i - 1];
                this.selection[i - 1] = this.selection[i];
                this.selection[i] = temp;
            }
        }
        this.update();
    }

    shiftDown() {
        const hash = this.selectedRight.reduce((obj, el) => {
            obj[this.getKey(el)] = true;
            return obj;
        }, {});
        for (let i = this.selection.length - 1; i >= 0; i--) {
            const key = this.getKey(this.selection[i]);
            if (hash[key]) {
                const temp = this.selection[i + 1];
                this.selection[i + 1] = this.selection[i];
                this.selection[i] = temp;
            }
        }
        this.update();
    }

    protected update() {
        let res = this.selection;
        if (this.key) {
            res = res.map(x => x[this.key]);
        }
        this.onModelChange(res.slice());
        this.checkButtons();
    }

    writeValue(arr: T[]) {
        if (arr) {
            if (!Array.isArray(arr)) {
                throw new Error('Incoming value is not an array');
            }

            // move items from right back to left
            let count = this.selection.length;
            while (count--) {
                this.allOptions.unshift(this.selection.pop());
            }

            // if there is a key, map incoming values to objects
            let values = arr.slice();
            if (this.key) {
                const hash = this.allOptions.reduce((o, i) => {
                    o[i[this.key]] = i;
                    return o;
                }, {});
                values = ((values as unknown) as Array<string | number>).map(v => hash[v]).filter(x => x);
            }

            // move incoming items from left to right
            this.moveItems(values, this.allOptions, this.selection);

            // reset selection
            this.selectedRight = [];
            this.selectedLeft = [];
        }
    }

    private onModelChange = (model: T[]) => {};

    registerOnChange(fn: () => {}): void {
        this.onModelChange = fn;
    }

    // tslint:disable-next-line:no-unused-variable
    registerOnTouched(fn: () => {}): void {}

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    validate() {
        const err: {
            required?: boolean;
            invalid?: boolean;
        } = {};

        let valid = true;

        const checked = this.selection.length > 0;
        if (this.required && !checked) {
            err.required = true;
            valid = false;
        }

        return valid ? null : err;
    }
}
