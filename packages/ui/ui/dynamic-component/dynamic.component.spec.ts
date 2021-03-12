import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing'; // DO not forget to Import
import { RouterTestingModule } from '@angular/router/testing';
import { DynamicComponent } from './dynamic.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'ls-ui-test-custom-component',
    template: 'test',
})
class AComponent {}

describe('DynamicComponent', () => {
    let component: DynamicComponent;
    let fixture: ComponentFixture<DynamicComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [DynamicComponent, AComponent],
            providers: [{ provide: ChangeDetectorRef, useValue: {} }],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: {
                    entryComponents: [AComponent],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicComponent);
        component = fixture.componentInstance;
        component.item = AComponent;
        fixture.autoDetectChanges(true);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
