import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@labshare/ngx-core-services';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderConfig, HeaderEventKeys } from './header.event-keys';

@Component({
    selector: 'ls-ui-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy {
    public config: HeaderConfig = {} as HeaderConfig;
    private sub = new Subscription();

    constructor(private route: ActivatedRoute, private eventService: EventService) {
        if (this.route.snapshot.data.config) {
            this.config = this.route.snapshot.data.config;
        } else {
            this.config.text = '';
        }
        this.sub.add(
            this.eventService
                .get(HeaderEventKeys.Title)
                .pipe(filter(x => x))
                .subscribe(text => {
                    this.config.text = text;
                }),
        );
    }

    clickItem(item) {
        this.eventService.get(item.click).next(item);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
