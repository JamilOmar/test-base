import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Link } from './drop-down-menu.types';

@Component({
    selector: 'ls-ui-drop-down-menu',
    templateUrl: './drop-down-menu.component.html',
    styleUrls: ['./drop-down-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DropDownMenuComponent {
    @Input() text: string;
    @Input() icon: string;
    @Input() element: string;
    @Input() menu: Link[];
}
