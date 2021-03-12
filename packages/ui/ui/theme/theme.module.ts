import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Theme } from './theme.types';
import { DefaultTheme } from './default-theme';
import { THEME_TOKEN } from './injection-tokens/theme.token';

@NgModule({
    imports: [CommonModule, RouterModule],
})
export class ThemeModule {
    public static forRoot(themes?: Array<Theme>): ModuleWithProviders<ThemeModule> {
        const defaultThemes: Array<Theme> = [DefaultTheme];
        const allThemes = themes ? defaultThemes.concat(themes) : defaultThemes;
        return {
            ngModule: ThemeModule,
            providers: [
                {
                    provide: THEME_TOKEN,
                    useValue: allThemes,
                },
            ],
        };
    }
}
