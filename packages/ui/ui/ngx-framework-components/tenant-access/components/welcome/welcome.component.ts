import { Component, OnInit } from '@angular/core';
import { AuthService } from '@labshare/ngx-core-services';
import { WizardService } from '../../../services/wizard.service';
import { captions } from './captions';

@Component({
    selector: 'ls-lib-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
    public captions = captions;

    constructor(private wizardService: WizardService, private authService: AuthService) {}

    ngOnInit() {
        this.authService.endSession();
    }

    startNewTenantProcess() {
        this.wizardService.startNewTenantProcess();
    }

    goToDashboardWelcome() {
        this.wizardService.accessExistingTenant();
    }
}
