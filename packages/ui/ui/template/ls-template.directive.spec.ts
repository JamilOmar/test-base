import { LsTemplateDirective } from './ls-template.directive';
import { Component, ContentChildren, TemplateRef, AfterContentInit } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Dictionary } from '@labshare/ngx-core-services';

@Component({
    selector: 'ls-test-comp',
    template: ` <div><ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-container></div> `,
})
export class TestDirectiveComponent implements AfterContentInit {
    @ContentChildren(LsTemplateDirective) templates;
    public item;
    public temps: TemplateRef<unknown>[];
    public tempsByType = {} as Dictionary<LsTemplateDirective>;

    ngAfterContentInit() {
        this.temps = this.templates;
        this.templates.forEach(item => {
            const type = item.getType();
            this.tempsByType[type] = item.template;
        });
    }
}

@Component({
    template: `
        <ls-test-comp>
            <ng-template lsTemplate="item1" let-node>
                <span>test</span>
            </ng-template>

            <ng-template lsTemplate="item2" let-node>
                <span>test</span>
            </ng-template>
        </ls-test-comp>
    `,
})
export class TestUseComponent {}

describe('LsTemplateDirective', () => {
    let fixture: ComponentFixture<TestUseComponent>;
    let dir: TestDirectiveComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestUseComponent, TestDirectiveComponent, LsTemplateDirective],
            imports: [CommonModule],
            providers: [],
        });

        fixture = TestBed.createComponent(TestUseComponent);
        fixture.detectChanges();
        const comp = fixture.debugElement.query(By.directive(TestDirectiveComponent));
        dir = comp.injector.get(TestDirectiveComponent);
    });

    it('should be defined', () => {
        expect(LsTemplateDirective).toBeDefined();
        expect(dir.temps.length).toEqual(2);
        expect(dir.tempsByType.item1).toBeDefined();
        expect(dir.tempsByType.item2).toBeDefined();
    });
});
