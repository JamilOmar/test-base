import { CommonModule } from '@angular/common';
import { Injector } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { DefaultTheme } from './default-theme';
import { THEME_TOKEN } from './injection-tokens/theme.token';
import { ThemeModule } from './theme.module';
import { Theme } from './theme.types';

describe('ThemeModule', () => {
    let injector: Injector;

    describe('Default Theme', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ThemeModule],
            }).compileComponents();
            injector = getTestBed();
        });

        it('should get default theme', () => {
            const value = injector.get(THEME_TOKEN);
            expect(value).toEqual([DefaultTheme]);
        });
    });

    describe('Custom Theme', () => {
        const customTheme = { name: 'custom', properties: { a: 'a' } } as Theme;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ThemeModule.forRoot([customTheme])],
            }).compileComponents();
            injector = getTestBed();
        });

        it('should get default theme and custom theme', () => {
            const value = injector.get(THEME_TOKEN);
            expect(value).toEqual([DefaultTheme, customTheme]);
        });
    });

    describe('Empty Custom Theme', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CommonModule, ThemeModule.forRoot()],
            }).compileComponents();
            injector = getTestBed();
        });

        it('should get default theme and custom theme', () => {
            const value = injector.get(THEME_TOKEN);
            expect(value).toEqual([DefaultTheme]);
        });
    });
});
