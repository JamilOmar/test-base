import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DualSelectComponent } from './dualselect.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
    declarations: [DualSelectComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    exports: [DualSelectComponent],
})
export class DualSelectModule {}
