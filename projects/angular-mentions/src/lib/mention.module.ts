import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MentionListComponent } from './mention-list.component';
import { MentionDirective } from './mention.directive';

@NgModule({
    declarations: [
        MentionDirective,
        MentionListComponent
    ],
    imports: [
        CommonModule,
        OverlayModule
    ],
    exports: [
        MentionDirective
    ],
})
export class MentionModule { }
