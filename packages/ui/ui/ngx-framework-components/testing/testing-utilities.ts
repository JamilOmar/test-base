/** reusable testing utility fuinctions for angular based tests */

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';

export class TestingUtilities {
    public static getNativeElement<T>(fixture: ComponentFixture<T>, query: string): HTMLInputElement {
        const debugElement: DebugElement = fixture.debugElement;
        const element = debugElement.query(By.css(query));

        return element.nativeElement;
    }
}
