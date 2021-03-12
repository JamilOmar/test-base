import { TeamCreatedComponent } from './components/team-created/team-created.component';
import { ProfileComponent } from './components/profile/profile.component';
import { IdentityProviderSelectionComponent } from './components/identity-provider-selection/identity-provider-selection.component';
import { CreateTenantComponent } from './components/create-tenant/create-tenant.component';
import { RouteName } from '../shared/constants';
import { WizardGuardService } from '../services/wizard-guard.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TenantAccessComponent } from './tenant-access.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: RouteName.Welcome,
    },
    {
        path: '',
        component: TenantAccessComponent,
        children: [
            {
                path: RouteName.Welcome,
                component: WelcomeComponent,
            },
            {
                path: RouteName.Profile,
                component: ProfileComponent,
                canActivate: [WizardGuardService],
            },
            {
                path: RouteName.IdentityProvider,
                component: IdentityProviderSelectionComponent,
                canActivate: [WizardGuardService],
            },
            {
                path: RouteName.CreateTenant,
                component: CreateTenantComponent,
                canActivate: [WizardGuardService],
            },
            {
                path: RouteName.TeamCreated,
                component: TeamCreatedComponent,
                canActivate: [WizardGuardService],
            },
        ],
    },
];
