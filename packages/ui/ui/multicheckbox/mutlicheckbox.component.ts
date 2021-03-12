import { AfterContentInit, Component, ContentChildren, Input, OnInit, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { LsTemplateDirective } from '@labshare/base-ui/template';

@Component({
    providers: [
        {
            multi: true,
            provide: NG_VALUE_ACCESSOR,
            useExisting: MutlicheckboxComponent,
        },
        {
            multi: true,
            provide: NG_VALIDATORS,
            useExisting: MutlicheckboxComponent,
        },
    ],
    selector: 'ls-mutlicheckbox',
    templateUrl: './mutlicheckbox.component.html',
    styleUrls: ['./mutlicheckbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MutlicheckboxComponent<T = number | string | object> implements ControlValueAccessor, Validator, OnInit, AfterContentInit {
    @Input() options: T[] = [];
    @Input() required = false;
    @Input() display = '';
    @Input() key = '';
    @ContentChildren(LsTemplateDirective) templates: QueryList<LsTemplateDirective>;
    public itemTemplate: TemplateRef<unknown>;
    public disabled = false;
    public selected = [];

    ngAfterContentInit() {
        this.templates.forEach(item => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngOnInit() {
        this.selected = this.options.map(() => false);
    }

    change() {
        let res = this.options.filter((x, i) => this.selected[i]);
        if (this.key) {
            res = res.map(x => x[this.key]);
        }
        this.onModelChange(res);
    }

    onModelChange = (model: T[]) => {};
    onModelTouched = (model: T[]) => {};

    writeValue(arr: T[]) {
        if (arr) {
            if (!Array.isArray(arr)) {
                throw new Error('Incoming value is not an array');
            }
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i];
                const search = this.key ? option[this.key] : option;
                this.selected[i] = arr.indexOf(search) > -1;
            }
        }
        this.change();
    }

    registerOnChange(fn: () => {}): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: () => {}): void {
        this.onModelTouched = fn;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }

    validate() {
        const err: {
            required?: boolean;
            invalid?: boolean;
        } = {};

        let valid = true;

        const checked = this.selected.some(o => o);
        if (this.required && !checked) {
            err.required = true;
            valid = false;
        }

        return valid ? null : err;
    }
}
