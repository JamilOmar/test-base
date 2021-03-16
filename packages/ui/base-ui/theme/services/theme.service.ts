import { Injectable, Inject } from '@angular/core';
import { Theme } from '../theme.types';
import { THEME_TOKEN } from '../injection-tokens/theme.token';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    constructor(@Inject(THEME_TOKEN) private themes: Array<Theme>) {}

    setActiveTheme(name: string): void {
        const activeTheme = this.themes.find(theme => theme.name === name);
        if (!activeTheme) {
            throw new Error(`Theme with name ${name} was not found`);
        }

        if (activeTheme.extend) {
            const baseTheme = this.themes.find(theme => theme.name === activeTheme.extend);
            const tempProps = {};
            for (const prop of Object.keys(baseTheme.properties)) {
                tempProps[prop] = baseTheme.properties[prop];
            }
            for (const prop of Object.keys(activeTheme.properties)) {
                tempProps[prop] = activeTheme.properties[prop];
            }
            activeTheme.properties = tempProps;
        }

        for (const prop of Object.keys(activeTheme.properties)) {
            const propVarName = `--${prop}`;
            document.documentElement.style.setProperty(propVarName, activeTheme.properties[prop]);
        }
    }
}
