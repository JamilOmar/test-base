import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileComponent } from './user-profile.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [UserProfileComponent],
    imports: [CommonModule, NgbModule, RouterModule],
    exports: [UserProfileComponent],
})
export class UserProfileModule {}
