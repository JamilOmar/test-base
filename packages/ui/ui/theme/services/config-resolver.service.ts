import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Resolve } from '@angular/router';
import { ThemeService } from './theme.service';

@Injectable({ providedIn: 'root' })
export class ConfigResolverService implements Resolve<any> {
    constructor(private themeService: ThemeService) {}

    resolve(route: ActivatedRouteSnapshot) {
        if (route.routeConfig && route.routeConfig.data && route.routeConfig.data.theme) {
            this.themeService.setActiveTheme(route.routeConfig.data.theme);
        } else {
            this.themeService.setActiveTheme('default'); // todo: create token
        }
    }
}
