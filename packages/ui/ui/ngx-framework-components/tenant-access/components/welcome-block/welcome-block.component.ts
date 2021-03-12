import { Component } from '@angular/core';
import { captions } from './captions';

@Component({
    selector: 'ls-lib-welcome-block',
    templateUrl: './welcome-block.component.html',
    styleUrls: ['./welcome-block.component.scss'],
})
export class WelcomeBlockComponent {
    public captions = captions;
}
