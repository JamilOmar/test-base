import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeftNavComponent } from './left-menu.component';

@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [LeftNavComponent],
    exports: [LeftNavComponent],
})
export class LeftMenuModule {}
