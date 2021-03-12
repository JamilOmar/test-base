import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormBuilder, Validators } from '@angular/forms';
import {
    FieldLengthLimits,
    FieldValidationMessages,
    LocalStorageKeys,
    RouteName,
    ValidationRegexPatterns,
    KeyStatusCode,
    KeyErrorCode,
    MessagesErrorStatus,
    MessageErrorCode,
} from '../../../shared/constants';
import { Tenant, User } from '../../../shared/types';
import { Router, ActivatedRoute } from '@angular/router';
import { captions } from './captions';
import { WizardService } from '../../../services/wizard.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';
import { get } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import slugify from 'slugify';

@Component({
    selector: 'ls-lib-create-tenant',
    templateUrl: './create-tenant.component.html',
    styleUrls: ['./create-tenant.component.scss'],
})
export class CreateTenantComponent implements OnInit, OnDestroy {
    public captions = captions;
    public disableCreateButton = false;
    public sub: Subscription = new Subscription();
    public profileInfo: User;
    public characterLimitMessage = FieldValidationMessages.CharacterLimit;
    public fieldLengthLimits = FieldLengthLimits;
    public message = '';

    @ViewChild('contentModal')
    private contentModalTpl: TemplateRef<string>;

    constructor(
        private fb: FormBuilder,
        private utilService: UtilService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private wizardService: WizardService,
        private modalService: NgbModal,
    ) {}

    createTenantForm = this.fb.group({
        title: this.fb.control('', [
            Validators.required,
            Validators.pattern(ValidationRegexPatterns.TeamName),
            Validators.maxLength(this.fieldLengthLimits.TeamName),
        ]),
        id: this.fb.control('', [
            Validators.required,
            Validators.pattern(ValidationRegexPatterns.ShortName),
            Validators.maxLength(this.fieldLengthLimits.ShortName),
        ]),
    });

    ngOnInit() {
        this.getExistingValues();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getExistingValues() {
        const storedValues = this.utilService.getFromLocalStorage(LocalStorageKeys.TenantInfo);
        if (storedValues) {
            const tenant: Tenant = JSON.parse(storedValues);

            this.createTenantForm.setValue({
                title: tenant.title,
                id: tenant.id,
            });
        }
        if (this.utilService.getFromLocalStorage(LocalStorageKeys.ProfileInfo)) {
            this.profileInfo = JSON.parse(this.utilService.getFromLocalStorage(LocalStorageKeys.ProfileInfo));
        }
    }

    slugifyInput() {
        this.createTenantForm.controls.id.setValue(
            slugify(this.createTenantForm.controls.title.value.substring(0, this.fieldLengthLimits.ShortName), {
                lower: true,
                remove: ValidationRegexPatterns.ShortNameSlugifyRemove,
            }),
        );
    }

    resetUniqueValidation() {
        const idFormControl = this.createTenantForm.controls.id;
        if (idFormControl.hasError('exists')) {
            idFormControl.setErrors({ exists: false });
        }
    }

    createTeam() {
        const tenant: Tenant = this.createTenantForm.value;
        if (tenant.id) {
            this.disableCreateButton = true;
            this.sub.add(
                this.wizardService
                    .addTenant(tenant)
                    .pipe(
                        catchError(err => {
                            if (get(err, KeyErrorCode) === MessageErrorCode.TEAM_ALREADY_EXISTS) {
                                this.createTenantForm.controls.id.setErrors({ exists: true });
                            } else {
                                this.message = MessagesErrorStatus[get(err, KeyStatusCode, 'error')];
                                this.modalService.open(this.contentModalTpl, { size: 'sm', backdrop: 'static' });
                            }

                            this.disableCreateButton = false;
                            return throwError(err);
                        }),
                    )
                    .subscribe(() => {
                        this.utilService.saveToLocalStorage(LocalStorageKeys.TenantInfo, JSON.stringify(tenant));
                        this.wizardService.updateSelfProfile(tenant.id, this.profileInfo).subscribe(() => {
                            this.router.navigate(['../' + RouteName.TeamCreated], { relativeTo: this.activeRoute });
                        });
                    }),
            );
        }
    }

    save() {
        const { title, id } = this.createTenantForm.value;
        const tenant: Tenant = { title, id };
        this.utilService.saveToLocalStorage(LocalStorageKeys.TenantInfo, JSON.stringify(tenant));
    }

    goToPreviousStep() {
        this.save();
        this.router.navigate(['../' + RouteName.Profile], { relativeTo: this.activeRoute });
    }
}
