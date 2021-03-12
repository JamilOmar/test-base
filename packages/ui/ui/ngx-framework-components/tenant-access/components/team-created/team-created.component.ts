import { Component, EventEmitter, Output } from '@angular/core';
import { EventKeys, EventService } from '@labshare/ngx-core-services';
import { Tenant, User } from '../../../shared/types';
import { UtilService } from '../../../services/util.service';
import { captions } from './captions';
import { LocalStorageKeys } from '../../../shared/constants';

@Component({
    selector: 'ls-lib-team-created',
    templateUrl: './team-created.component.html',
    styleUrls: ['./team-created.component.scss'],
})
export class TeamCreatedComponent {
    @Output() finalData = new EventEmitter();
    public captions = captions;
    public disableFinishButton = false;
    public users: Array<User> = [];

    constructor(private utilService: UtilService, private eventService: EventService) {}

    done() {
        const tenantInfo = this.utilService.getFromLocalStorage(LocalStorageKeys.TenantInfo);
        if (tenantInfo) {
            const tenant: Tenant = JSON.parse(tenantInfo);
            this.eventService.get(EventKeys.SwitchTenant).next(tenant.id);
        }
    }
}
