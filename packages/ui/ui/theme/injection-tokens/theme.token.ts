import { InjectionToken } from '@angular/core';
import { Theme } from '../theme.types';
import { DefaultTheme } from '../default-theme';

export const THEME_TOKEN = new InjectionToken<Array<Theme>>('THEME', { providedIn: 'root', factory: () => [DefaultTheme] });
