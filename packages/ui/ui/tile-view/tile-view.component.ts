import { Component, AfterContentInit, Input, Output, ContentChildren, EventEmitter, TemplateRef, QueryList, ViewEncapsulation } from '@angular/core';
import { LsTemplateDirective } from '@labshare/base-ui/template';

@Component({
    selector: 'ls-tile-view',
    templateUrl: './tile-view.component.html',
    styleUrls: ['./tile-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TileViewComponent<T> implements AfterContentInit {
    @Input() get items(): T[] {
        return this.localItems;
    }

    set items(val: T[]) {
        this.selection = null;
        this.selectedIndex = -1;
        this.localItems = val;
    }

    @Input() selection: T;
    @Output() selectionChange: EventEmitter<T> = new EventEmitter<T>();
    @Output() selectItem: EventEmitter<T> = new EventEmitter();
    @ContentChildren(LsTemplateDirective) templates: QueryList<LsTemplateDirective>;

    public itemTemplate: TemplateRef<unknown>;
    public selectedIndex = -1;
    public localItems: T[];

    ngAfterContentInit() {
        // this logic allows to define templates for different parts of the component
        this.templates.forEach(item => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                /* example
                case 'header':
                    this.headerTemplate = item.template;
                */
            }
        });
    }

    click(index: number) {
        this.selectedIndex = index;
        this.selection = this.items[index];
        this.selectionChange.emit(this.selection);
        this.selectItem.emit(this.selection);
    }
}
