import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutDefaultComponent } from './layout-default.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [LayoutDefaultComponent],
    imports: [CommonModule, RouterModule],
    exports: [LayoutDefaultComponent],
})
export class LayoutDefaultModule {}
