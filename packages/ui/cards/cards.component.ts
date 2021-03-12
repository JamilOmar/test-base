import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewEncapsulation,
} from '@angular/core';
import { LsTemplateDirective } from '@labshare/base-ui/template';
import { ObjectUtils } from '@labshare/base-ui/object-utilities';
import { SelectionEvent } from '@labshare/base-ui/types';

export enum CardTemplateType {
    item = 'item',
}

@Component({
    selector: 'ls-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CardsComponent<T extends number | string | object> implements AfterContentInit {
    @ContentChildren(LsTemplateDirective) templates: QueryList<LsTemplateDirective>;

    @Output() selectionChange: EventEmitter<T[]> = new EventEmitter();
    @Output() selectionChanges: EventEmitter<SelectionEvent<T>> = new EventEmitter();
    @Output() doubleClick: EventEmitter<T> = new EventEmitter();

    @Input() metaKeySelection = true;

    @Input() set selection(val: T[]) {
        this.pSelection = val;
    }
    get selection(): T[] {
        return this.pSelection;
    }

    @Input() set value(val: T[]) {
        this.pValue = val;
    }
    get value(): T[] {
        return this.pValue;
    }

    public itemTemplate: TemplateRef<unknown>;

    private pSelection: T[];
    private pValue: T[];

    ngAfterContentInit() {
        this.templates.forEach(item => {
            switch (item.getType()) {
                case CardTemplateType.item:
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    onDoubleClick(item: T) {
        this.doubleClick.emit(item);
    }

    onItemClick(event: MouseEvent, item: T, index: number) {
        const selectedIndex = ObjectUtils.findIndexInList(item, this.selection);
        const selected = selectedIndex !== -1;
        const metaKeyPressed = event.metaKey || event.ctrlKey || event.shiftKey;

        if (selected && metaKeyPressed) {
            this.pSelection = this.pSelection.filter((val, i) => i !== selectedIndex);
        } else {
            this.pSelection = metaKeyPressed ? (this.pSelection ? [...this.pSelection] : []) : [];
            ObjectUtils.insertIntoOrderedArray(item, index, this.pSelection, this.value);
        }

        this.pSelection = this.pSelection.filter(x => x);

        // binding
        this.selectionChange.emit(this.pSelection);

        // event
        this.selectionChanges.emit({ originalEvent: event, value: this.pSelection });
    }

    isSelected(item: T) {
        return ObjectUtils.findIndexInList(item, this.selection) !== -1;
    }
}
