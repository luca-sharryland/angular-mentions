import { AfterContentChecked, Component, ElementRef, Inject, Input, TemplateRef, ViewChild } from '@angular/core';

import { getCaretCoordinates } from './caret-coords';
import { MentionService } from './mention.service';
import { getContentEditableCaretCoords, isInputOrTextAreaElement, MENTIONS_DATA } from './mention-utils';

/**
 * Angular Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
@Component({
  selector: 'mention-list',
  styleUrls: ['./mention-list.component.scss'],
  template: `
    <ng-template #defaultItemTemplate let-item="item">
      {{item[labelKey]}}
    </ng-template>
    <ul #list [hidden]="hidden" class="mention-list"
      [class.mention-list__mention-menu]="!styleOff">
      <li *ngFor="let item of mentionService?.items; let i = index"
        [class.active]="activeIndex==i" [class.mention-list__mention-active]="!styleOff && activeIndex==i">
        <a [class.mention-list__mention-item]="!styleOff"
          (mousedown)="onClick(i);$event.preventDefault()">
          <ng-template [ngTemplateOutlet]="itemTemplate" [ngTemplateOutletContext]="{'item':item}"></ng-template>
        </a>
      </li>
    </ul>
    `
})
export class MentionListComponent implements AfterContentChecked {

  @ViewChild('list', { static: true }) list: ElementRef;
  @ViewChild('defaultItemTemplate', { static: true }) defaultItemTemplate: TemplateRef<any>;
  labelKey: string = 'label';
  itemTemplate: TemplateRef<any>;
  activeIndex: number = 0;
  hidden: boolean = false;
  styleOff: boolean = false;

  constructor(
    public mentionService: MentionService,
    @Inject(MENTIONS_DATA) public mentionsData: {
      labelKey: string;
      itemTemplate: TemplateRef<any>;
      styleOff: boolean;
      activeIndex: number;
    }
  ) {
    this.labelKey = mentionsData?.labelKey;
    this.itemTemplate = mentionsData?.itemTemplate;
    this.styleOff = mentionsData?.styleOff;
    this.activeIndex = mentionsData?.activeIndex;
    this.mentionService.activeItem = this.mentionService.items[this.activeIndex];
    this.mentionService.activateItem$.subscribe({
      next: direction => {
        if (direction === 'next') {
          this.activateNextItem();
        } else {
          this.activatePreviousItem();
        }
      }
    })
  }

  ngAfterContentChecked() {
    if (!this.itemTemplate) {
      this.itemTemplate = this.defaultItemTemplate;
    }
  }

  activateNextItem() {
    // adjust scrollable-menu offset if the next item is out of view
    let listEl: HTMLElement = this.list?.nativeElement;
    let activeEl = listEl?.getElementsByClassName('active')?.item(0);
    if (activeEl) {
      let nextLiEl: HTMLElement = <HTMLElement>activeEl.nextSibling;
      if (nextLiEl && nextLiEl.nodeName == "LI") {
        let nextLiRect: ClientRect = nextLiEl.getBoundingClientRect();
        if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
          listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
        }
      }
    }
    // select the next item
    this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.mentionService.items.length - 1), 0);
    this.mentionService.activeItem = this.mentionService.items[this.activeIndex];
  }

  activatePreviousItem() {
    // adjust the scrollable-menu offset if the previous item is out of view
    let listEl: HTMLElement = this.list?.nativeElement;
    let activeEl = listEl?.getElementsByClassName('active')?.item(0);
    if (activeEl) {
      let prevLiEl: HTMLElement = <HTMLElement>activeEl.previousSibling;
      if (prevLiEl && prevLiEl.nodeName == "LI") {
        let prevLiRect: ClientRect = prevLiEl.getBoundingClientRect();
        if (prevLiRect.top < listEl.getBoundingClientRect().top) {
          listEl.scrollTop = prevLiEl.offsetTop;
        }
      }
    }
    // select the previous item
    this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.mentionService.items.length - 1), 0);
    this.mentionService.activeItem = this.mentionService.items[this.activeIndex];
  }

  onClick(index: number) {
    this.activeIndex = index;
    this.mentionService.activeItem = this.mentionService.items[this.activeIndex];
    this.mentionService.click();
  }
}
