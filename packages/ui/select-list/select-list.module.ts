import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectListComponent } from './select-list.component';

@NgModule({
    imports: [CommonModule],
    exports: [SelectListComponent],
    declarations: [SelectListComponent],
})
export class SelectListModule {}
