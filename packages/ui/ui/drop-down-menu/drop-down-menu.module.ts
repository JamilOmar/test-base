import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropDownMenuComponent } from './drop-down-menu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [DropDownMenuComponent],
    imports: [CommonModule, NgbModule],
    exports: [DropDownMenuComponent],
})
export class DropDownMenuModule {}
