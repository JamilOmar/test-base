import { Component, OnDestroy, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldLengthLimits, FieldValidationMessages, LocalStorageKeys, RouteName, ValidationRegexPatterns } from '../../../shared/constants';
import { User } from '../../../shared/types';
import { WizardService } from '../../../services/wizard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { captions } from './captions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ls-lib-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    public captions = captions;
    public group: string;
    public characterLimitMessage = FieldValidationMessages.CharacterLimit;
    public fieldLengthLimits = FieldLengthLimits;

    public profileForm = this.fb.group({
        email: this.fb.control('', [Validators.required, Validators.pattern(ValidationRegexPatterns.Email)]),
        firstName: this.fb.control('', [
            Validators.required,
            Validators.pattern(ValidationRegexPatterns.FirstName),
            Validators.maxLength(this.fieldLengthLimits.FirstName),
        ]),
        lastName: this.fb.control('', [
            Validators.required,
            Validators.pattern(ValidationRegexPatterns.LastName),
            Validators.maxLength(this.fieldLengthLimits.LastName),
        ]),
        displayName: this.fb.control('', [
            Validators.required,
            Validators.pattern(ValidationRegexPatterns.DisplayName),
            Validators.maxLength(this.fieldLengthLimits.DisplayName),
        ]),
        jobTitle: this.fb.control('', [Validators.pattern(ValidationRegexPatterns.JobTitle), Validators.maxLength(this.fieldLengthLimits.JobTitle)]),
        organization: this.fb.control('', [
            Validators.pattern(ValidationRegexPatterns.Organization),
            Validators.maxLength(this.fieldLengthLimits.Organization),
        ]),
    });

    private sub = new Subscription();

    constructor(
        private fb: FormBuilder,
        private utilService: UtilService,
        private wizardService: WizardService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.group = captions.roleDefault;
    }

    ngOnInit() {
        let storedValues: User;
        this.sub.add(
            this.wizardService.getAdminGroup().subscribe(data => {
                this.group = data.name;
            }),
        );

        if (this.utilService.getFromLocalStorage(LocalStorageKeys.ProfileInfo)) {
            storedValues = JSON.parse(this.utilService.getFromLocalStorage(LocalStorageKeys.ProfileInfo));
        } else {
            this.sub.add(
                this.utilService.getLoggedInUserProfile().subscribe(profile => {
                    this.profileForm.controls.email.setValue(profile.email);
                    this.profileForm.controls.firstName.setValue(profile.given_name);
                    this.profileForm.controls.lastName.setValue(profile.family_name);
                }),
            );
            this.updateDisplayName();
        }
        if (!storedValues) {
            return;
        }

        this.profileForm.setValue({
            email: storedValues.email || '',
            firstName: storedValues.firstName || '',
            lastName: storedValues.lastName || '',
            displayName: storedValues.displayName || '',
            jobTitle: storedValues.jobTitle || '',
            organization: storedValues.organization || '',
        });
    }

    updateDisplayName() {
        this.profileForm.controls.displayName.setValue(this.profileForm.controls.firstName.value + ' ' + this.profileForm.controls.lastName.value);
    }

    save() {
        const mainUser: User = {
            ...this.profileForm.value,
        };
        this.utilService.saveToLocalStorage(LocalStorageKeys.ProfileInfo, JSON.stringify(mainUser));
    }

    goToNextStep() {
        this.save();
        this.router.navigate(['../' + RouteName.CreateTenant], { relativeTo: this.activatedRoute });
    }

    goToPreviousStep() {
        this.save();
        this.router.navigate(['../' + RouteName.Welcome], { relativeTo: this.activatedRoute });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
