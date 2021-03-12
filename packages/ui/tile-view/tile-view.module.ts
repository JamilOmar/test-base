import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileViewComponent } from './tile-view.component';
import { LsTemplateModule } from '@labshare/base-ui/template';

@NgModule({
    declarations: [TileViewComponent],
    imports: [CommonModule, LsTemplateModule],
    exports: [TileViewComponent, LsTemplateModule],
})
export class TileViewModule {}
