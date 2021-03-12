import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UtilService } from './services/util.service';
import { MulticheckboxModule } from '@labshare/base-ui/multicheckbox';
import { HttpClientModule } from '@angular/common/http';
import { TenantAccessModule } from './tenant-access/tenant-access.module';

@NgModule({
    declarations: [],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, MulticheckboxModule, TenantAccessModule],
    providers: [UtilService],
    exports: [],
})
export class NgxFrameworkComponentsModule {}
