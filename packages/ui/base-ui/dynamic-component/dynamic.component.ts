import {
    Component,
    Input,
    Type,
    AfterViewInit,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef,
    ChangeDetectorRef,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'ls-ui-custom-component',
    templateUrl: './dynamic.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DynamicComponent implements AfterViewInit {
    @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
    @Input() item: Type<unknown>;

    constructor(private resolver: ComponentFactoryResolver, private changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.container.clear();
        const componentRef = this.container.createComponent(this.resolver.resolveComponentFactory(this.item));
        const element: HTMLElement = componentRef.location.nativeElement as HTMLElement;
        this.container.element.nativeElement.appendChild(element);
        this.changeDetectorRef.detectChanges();
    }
}
