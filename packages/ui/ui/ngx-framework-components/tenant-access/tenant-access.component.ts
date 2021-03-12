import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WizardService } from '../services/wizard.service';

@Component({
    selector: 'ls-lib-root',
    templateUrl: './tenant-access.component.html',
    styleUrls: ['./tenant-access.component.scss'],
})
export class TenantAccessComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private wizardService: WizardService) {}

    ngOnInit(): void {
        this.wizardService.setBaseRoute(this.activatedRoute.snapshot.data.baseRoute || '/');
    }
}
