import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MulticheckboxModule } from '@labshare/base-ui/multicheckbox';
import { HttpClientModule } from '@angular/common/http';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { WelcomeBlockComponent } from './components/welcome-block/welcome-block.component';
import { TeamCreatedComponent } from './components/team-created/team-created.component';
import { CreateTeamMembersComponent } from './components/create-team-members/create-team-members.component';
import { CreateTenantComponent } from './components/create-tenant/create-tenant.component';
import { IdentityProviderSelectionComponent } from './components/identity-provider-selection/identity-provider-selection.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VersionComponent } from './components/welcome-block/version/version.component';
import { routes } from './tenant-access-routing';
import { TenantAccessComponent } from './tenant-access.component';

@NgModule({
    declarations: [
        WelcomeComponent,
        WelcomeBlockComponent,
        CreateTeamMembersComponent,
        CreateTenantComponent,
        IdentityProviderSelectionComponent,
        ProfileComponent,
        TeamCreatedComponent,
        VersionComponent,
        TenantAccessComponent,
    ],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, MulticheckboxModule, RouterModule.forChild(routes)],
    providers: [],
    exports: [
        WelcomeComponent,
        WelcomeBlockComponent,
        CreateTeamMembersComponent,
        CreateTenantComponent,
        IdentityProviderSelectionComponent,
        ProfileComponent,
        TeamCreatedComponent,
        VersionComponent,
    ],
})
export class TenantAccessModule {}
