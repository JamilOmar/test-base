import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { LocalStorageKeys, RouteName } from '../../../shared/constants';
import { WizardService } from '../../../services/wizard.service';
import { filter } from 'rxjs/internal/operators/filter';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ls-lib-identity-provider-selection',
    templateUrl: './identity-provider-selection.component.html',
    styleUrls: ['./identity-provider-selection.component.scss'],
})
export class IdentityProviderSelectionComponent implements OnInit, OnDestroy {
    private sub = new Subscription();
    public allProviders = [];
    public formGroup: FormGroup = this.fb.group({
        providers: this.fb.control([]),
    });
    public providers = this.formGroup.controls.providers as FormArray;

    constructor(
        private fb: FormBuilder,
        private utilService: UtilService,
        private wizardService: WizardService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.sub.add(
            this.wizardService
                .getIdentityProviders()
                .pipe(filter(x => !!x))
                .subscribe(data => {
                    this.allProviders = data;
                    const val = this.utilService.getFromLocalStorage(LocalStorageKeys.IdentityProvider);
                    if (val) {
                        this.formGroup.patchValue({ providers: JSON.parse(val) });
                    }
                }),
        );
    }

    save() {
        this.utilService.saveToLocalStorage(LocalStorageKeys.IdentityProvider, JSON.stringify(this.providers.value));
    }

    goToNextStep() {
        this.save();
        this.router.navigate(['../' + RouteName.CreateTenant], { relativeTo: this.activeRoute });
    }

    goToPreviousStep() {
        this.save();
        this.router.navigate(['../' + RouteName.Profile], { relativeTo: this.activeRoute });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
