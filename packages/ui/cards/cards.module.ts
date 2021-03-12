import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards.component';
import { LsTemplateModule } from '@labshare/base-ui/template';

@NgModule({
    declarations: [CardsComponent],
    imports: [CommonModule, LsTemplateModule],
    exports: [CardsComponent, LsTemplateModule],
})
export class CardsModule {}
