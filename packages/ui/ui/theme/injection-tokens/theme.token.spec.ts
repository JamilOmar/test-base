import { CommonModule } from '@angular/common';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { DefaultTheme } from '../default-theme';
import { THEME_TOKEN } from './theme.token';

describe('THEME_TOKEN', () => {
    let injector: Injector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
        }).compileComponents();
        injector = getTestBed();
    });

    it('should get default theme', () => {
        const value = injector.get(THEME_TOKEN);
        expect(value).toEqual([DefaultTheme]);
    });
});
