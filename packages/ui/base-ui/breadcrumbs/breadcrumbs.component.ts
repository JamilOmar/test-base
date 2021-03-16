import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ls-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BreadcrumbsComponent<T = string | number | object> implements OnInit, OnChanges {
    /** Input data array */
    @Input() paths: T[] = [];

    /** Specify which property of object to display. Required if options are objects  */
    @Input() display = '';

    /** Specify which property of object to return. Optional */
    @Input() key = '';

    /** Specify separator code between links. Optional */
    @Input() separator = '&rsaquo;';

    /** Emits results */
    @Output() selected = new EventEmitter<T>();

    public displayedPaths: string[] = [];

    protected getKey = (x: T): T => x;

    protected renderPaths(): void {
        if (this.key) {
            this.getKey = x => x[this.key];
        }
        this.displayedPaths = this.paths.map(p => (this.display ? p[this.display] : p));
    }

    public ngOnInit() {
        this.renderPaths();
    }

    public ngOnChanges(): void {
        this.renderPaths();
    }

    public navigate(index: number) {
        const val = this.getKey(this.paths[index]);
        this.selected.emit(val);
    }
}
