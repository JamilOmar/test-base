import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
    selector: '[lsTemplate]',
})
export class LsTemplateDirective<T = unknown> {
    @Input() type: string;
    @Input('lsTemplate') name: string;

    constructor(public template: TemplateRef<T>) {}

    getType(): string {
        return this.name;
    }
}
