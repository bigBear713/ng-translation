import { get } from 'lodash-es';
import {
    BehaviorSubject,
    Observable
} from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgTranslationService {

  lang$ = new BehaviorSubject<string>('en');

  private translations: { [key: string]: any } = {
    en: {
      title: 'title',
      content: {
        'helloWorld': 'hello world'
      }
    },
    'zh-CN': {
      title: '标题',
      content: {
        'helloWorld': '你好，世界'
      }
    }
  };

  get lang(): string {
    return this.lang$.value;
  }

  constructor() { }

  changeLang(lang: string): void {
    this.lang$.next(lang);
  }

  translationSync(key: string): string {
    return get(this.translations[this.lang], key);
  }

  translationAsync(key: string): Observable<string> {
    return this.lang$.pipe(
      map(_ => this.translationSync(key))
    );
  }

}
