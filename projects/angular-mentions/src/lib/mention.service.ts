import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MentionService implements OnDestroy {

  click$: Observable<boolean>;
  activateItem$: Observable<'next' | 'previous'>;
  private clickSubject: BehaviorSubject<boolean>;
  private activateItemSubject: BehaviorSubject<'next' | 'previous'>;
  private _activeItem: any;
  private _items: any[] = [];

  constructor() {
    this.clickSubject = new BehaviorSubject(false);
    this.activateItemSubject = new BehaviorSubject(null);
    this.click$ = this.clickSubject.asObservable();
    this.activateItem$ = this.activateItemSubject.asObservable();
  }

  click() {
    this.clickSubject.next(true);
  }

  get activeItem() {
    return this._activeItem;
  }

  set activeItem(item: any) {
    this._activeItem = item;
  }

  get items() {
    return this._items;
  }

  set items(it) {
    this._items = it || [];
  }

  activateItem(direction: 'previous' | 'next') {
    this.activateItemSubject.next(direction);
  }

  ngOnDestroy(): void {
    this.clickSubject.complete();
    this.activateItemSubject.complete();
  }
}