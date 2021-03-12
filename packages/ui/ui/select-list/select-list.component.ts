import {
    AfterContentInit,
    Input,
    Output,
    ContentChildren,
    QueryList,
    TemplateRef,
    EventEmitter,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
    AfterViewInit,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { LsTemplateDirective } from '@labshare/base-ui/template';
import { ObjectUtils } from '@labshare/base-ui/object-utilities';
import { SelectionEvent } from '@labshare/base-ui/types';

export enum TemplateType {
    item = 'item',
}

@Component({
    selector: 'ls-select-list',
    templateUrl: './select-list.component.html',
    styleUrls: ['./select-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SelectListComponent<T extends number | string | object> implements AfterContentInit, AfterViewInit {
    @ViewChild('listelement', { static: true, read: ElementRef }) listParent: ElementRef;
    @ContentChildren(LsTemplateDirective) templates: QueryList<LsTemplateDirective>;
    @Input() metaKeySelection = true;
    @Output() selectionChange: EventEmitter<T[]> = new EventEmitter();
    @Output() selectionChanges: EventEmitter<SelectionEvent<T>> = new EventEmitter();

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
                case TemplateType.item:
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    ngAfterViewInit() {
        if (this.pSelection && this.pSelection.length > 0) {
            const firstItem = this.pSelection[0];
            const index = ObjectUtils.findIndexInList(firstItem, this.pValue);
            if (index > -1) {
                const parent = this.listParent.nativeElement;
                const activeChild = parent.children[index];
                parent.scrollTop = activeChild.offsetTop - parent.offsetTop;
            }
        }
    }

    onItemClick(event: MouseEvent, item: T, index: number) {
        const selectedIndex = ObjectUtils.findIndexInList(item, this.selection);
        const selected = selectedIndex !== -1;
        const metaKey = event.metaKey || event.ctrlKey || event.shiftKey;

        if (selected && metaKey) {
            this.pSelection = this.pSelection.filter((val, i) => i !== selectedIndex);
        } else {
            this.pSelection = metaKey ? (this.pSelection ? [...this.pSelection] : []) : [];
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
