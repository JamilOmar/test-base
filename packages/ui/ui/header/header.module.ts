import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { DropDownMenuModule } from '@labshare/base-ui/drop-down-menu';
import { UserProfileModule } from '@labshare/base-ui/user-profile';
import { DynamicComponentModule } from '@labshare/base-ui/dynamic-component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [CommonModule, DropDownMenuModule, UserProfileModule, DynamicComponentModule],
    exports: [HeaderComponent],
})
export class HeaderModule {}
