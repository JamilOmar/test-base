import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MutlicheckboxComponent } from './mutlicheckbox.component';
import { LsTemplateModule } from '@labshare/base-ui/template';

@NgModule({
    declarations: [MutlicheckboxComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [MutlicheckboxComponent, LsTemplateModule],
})
export class MulticheckboxModule {}
