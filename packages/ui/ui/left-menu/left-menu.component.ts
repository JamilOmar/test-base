import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from './left-menu-item.interface';

@Component({
    selector: 'ls-ui-left-menu',
    templateUrl: './left-menu.component.html',
    styleUrls: ['./left-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LeftNavComponent {
    public items: MenuItem[];

    constructor(private route: ActivatedRoute) {
        this.items = this.route.snapshot.data?.items || [];
    }
}
