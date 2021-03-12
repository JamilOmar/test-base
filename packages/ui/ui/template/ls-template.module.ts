import { NgModule } from '@angular/core';
import { LsTemplateDirective } from './ls-template.directive';

@NgModule({
    declarations: [LsTemplateDirective],
    exports: [LsTemplateDirective],
})
export class LsTemplateModule {}
