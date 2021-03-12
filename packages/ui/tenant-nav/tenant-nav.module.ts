import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TenantNavComponent } from './tenant-nav.component';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, AvatarModule],
    declarations: [TenantNavComponent, SearchPipe],
    exports: [TenantNavComponent, SearchPipe],
})
export class TenantNavModule {}
