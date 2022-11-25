import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MentionDirective } from './mention.directive';
import { MentionListComponent } from './mention-list.component';
import { MentionService } from './mention.service';
import { OverlayModule } from '@angular/cdk/overlay';

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
    providers: [
        MentionService
    ]
})
export class MentionModule { }
