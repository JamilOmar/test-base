import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, EventKeys as CoreEventKeys } from '@labshare/ngx-core-services';
import { Tenant, Link, Logo, App, TenantPayload } from './tenant-nav.types';
import { Observable, Subscription } from 'rxjs';
import { TenantNavEventKeys } from './tenant-nav.event-keys';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'ls-ui-tenant-nav',
    templateUrl: './tenant-nav.component.html',
    styleUrls: ['./tenant-nav.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TenantNavComponent implements OnDestroy {
    public links: Link[] = [];
    public tenants: TenantPayload[];
    public apps: Observable<App[]>;
    public menuExpanded = false;
    public showTenantMenu = false;
    public query = '';
    public selectedApp: Observable<App>;
    public selectedTenant: Observable<Tenant>;
    public logoMinInitials = 3;
    public logos: Logo[] = [];
    private sub = new Subscription();

    constructor(private route: ActivatedRoute, private eventService: EventService) {
        this.links = this.route.snapshot.data?.links || [];
        this.apps = this.eventService.get(TenantNavEventKeys.AppList);
        this.selectedApp = this.eventService.get(TenantNavEventKeys.SelectedApp);
        this.selectedTenant = this.eventService.get(CoreEventKeys.Tenant);
        this.sub.add(
            this.eventService
                .get(TenantNavEventKeys.TenantList)
                .pipe(filter(x => x))
                .subscribe(tenants => {
                    this.tenants = tenants.map(tenant => {
                        const logoMaxInitials = Math.max(this.logoMinInitials, tenant.text.split(' ').length);
                        const logo = {
                            src: tenant.logo,
                            initialsSize: logoMaxInitials,
                            textSizeRatio: logoMaxInitials,
                        } as Logo;
                        return { tenant, logo } as TenantPayload;
                    });
                }),
        );
    }

    public showTenant(show: boolean) {
        if (!show) {
            this.query = '';
        }
        this.showTenantMenu = show;
        this.menuExpanded = show;
    }

    public toggle() {
        if (this.menuExpanded) {
            this.showTenantMenu = false;
            this.query = '';
        }
        this.menuExpanded = !this.menuExpanded;
    }

    public selectTenant(tenant: Tenant) {
        this.eventService.get(CoreEventKeys.SwitchTenant).next(tenant);
    }

    public selectApp(app: App) {
        this.eventService.get(TenantNavEventKeys.OnSelectApp).next(app);
    }

    public viewAllTenants() {
        this.eventService.get(TenantNavEventKeys.ViewAllTenants).next(true);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
