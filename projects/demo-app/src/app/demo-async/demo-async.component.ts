import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { MentionConfig } from 'projects/angular-mentions/src/public-api';
import { Observable, of } from 'rxjs';
import { COMMON_NAMES } from '../common-names';

@Component({
  selector: 'app-demo-async',
  templateUrl: './demo-async.component.html'
})
export class DemoAsyncComponent {

  complexItems = [
    {
      "value": "user1",
      "email": "user1@domain.com",
      "name": "User One"
    },
    {
      "value": "user2",
      "email": "user2@domain.com",
      "name": "User Two"
    },
    {
      "value": "user3",
      "email": "user3@domain.com",
      "name": "User Three"
    }
  ];
  mentions: any[] = [];
  mentionConfig: MentionConfig = {
    mentions: [
      {
        labelKey: 'name',
        triggerChar: '#',
        maxItems: 10,
        returnTrigger: true,
        mentionSelect: this.format,
        mentionFilter: this.filter
      },
      {
        returnTrigger: true,
        maxItems: 10,
        triggerChar: '@'
      }
    ]
  };

  search(term: string) {
    if (term.startsWith('#')) {
      this.mentions = this.complexItems;
    } else {
      this.mentions = COMMON_NAMES;
    }
  }

  // this should be in a separate demo-async.service.ts file
  constructor(private http: HttpClient) { }
  getItems(term): Observable<any[]> {
    console.log('getItems:', term);
    if (!term) {
      // if the search term is empty, return an empty array
      return of([]);
    }
    // return this.http.get('api/names') // get all names
    return this.http.get<any[]>('api/objects?label=' + term); // get filtered names
  }

  format(item: any) {
    return item['value'].toUpperCase();
  }

  filter(searchString: string, items: any[]): any[] {
    return items.filter(item => item.name.toLowerCase().includes(searchString));
  }
}
