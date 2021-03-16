import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBlockComponent } from './welcome-block.component';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('WelcomeBlockComponent', () => {
    let component: WelcomeBlockComponent;
    let fixture: ComponentFixture<WelcomeBlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [WelcomeBlockComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
