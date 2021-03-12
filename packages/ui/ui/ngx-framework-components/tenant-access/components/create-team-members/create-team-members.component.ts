import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { LocalStorageKeys, RouteName, AuthKeys, ValidationRegexPatterns } from '../../../shared/constants';
import { Group, User, IdentityProvider } from '../../../shared/types';
import { WizardService } from '../../../services/wizard.service';
import { map } from 'rxjs/internal/operators/map';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ls-ls-lib-create-team-members',
    templateUrl: './create-team-members.component.html',
    styleUrls: ['./create-team-members.component.scss'],
})
export class CreateTeamMembersComponent implements OnInit, OnDestroy {
    @Input() groupList: Group[] = [];
    public providerList: IdentityProvider[] = [];
    public teamForm: FormGroup;
    public email: FormControl;
    public role: FormControl;
    public identityIssuer: FormControl;
    public users: Array<User>;

    private sub = new Subscription();

    constructor(
        private fb: FormBuilder,
        private utilService: UtilService,
        private wizardService: WizardService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {
        this.teamForm = this.newFormGroup();
        this.email = this.teamForm.controls.email as FormControl;
        this.role = this.teamForm.controls.role as FormControl;
        this.identityIssuer = this.teamForm.controls.role as FormControl;
        this.users = [];
    }

    ngOnInit() {
        this.getGroups();
        this.getIdentityProviders();

        if (this.utilService.getFromLocalStorage(LocalStorageKeys.NewMembers)) {
            this.users = JSON.parse(this.utilService.getFromLocalStorage(LocalStorageKeys.NewMembers));
        }
    }

    getGroups() {
        const groups: Group[] = [];
        this.wizardService
            .getRegularGroups()
            .pipe(
                map(g => {
                    groups.push(g as Group);
                }),
            )
            .toPromise()
            .then(() => {
                this.groupList = groups;
            });
    }

    getIdentityProviders() {
        this.sub.add(
            this.wizardService
                .getIdentityProviders()
                .pipe(filter(x => !!x))
                .subscribe((providers: IdentityProvider[]) => {
                    this.providerList = providers.map((provider: IdentityProvider) => {
                        const issuers = AuthKeys.IdentityProviderIssuers.filter(i => i.id === provider.id);
                        const issuer = issuers.length > 0 ? issuers[0].issuer : '';
                        const providerWithIssuer: IdentityProvider = { ...provider, identityIssuer: issuer };
                        return providerWithIssuer;
                    });
                }),
        );
    }

    newFormGroup() {
        return this.fb.group({
            email: this.fb.control('', [Validators.required, Validators.pattern(ValidationRegexPatterns.Email)]),
            firstName: this.fb.control(''),
            lastName: this.fb.control(''),
            role: this.fb.control('', [Validators.required]),
            identityIssuer: this.fb.control('', [Validators.required]),
        });
    }

    addUser() {
        const newUser: User = this.teamForm.value;
        const newUsers = [...this.users, newUser];
        this.users = newUsers;
        this.teamForm = this.newFormGroup();
    }

    saveData() {
        this.utilService.saveToLocalStorage(LocalStorageKeys.NewMembers, JSON.stringify(this.users));
    }

    goToNextStep() {
        this.saveData();
        this.router.navigate(['../' + RouteName.TeamCreated], { relativeTo: this.activeRoute });
    }

    goToPreviousStep() {
        this.saveData();
        this.router.navigate(['../' + RouteName.CreateTenant], { relativeTo: this.activeRoute });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
