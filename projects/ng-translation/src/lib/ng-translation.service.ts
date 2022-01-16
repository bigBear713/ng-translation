import {
  get,
  isFunction
} from 'lodash-es';
import {
  BehaviorSubject,
  from,
  Observable,
  of,
  Subject,
  timer
} from 'rxjs';
import {
  catchError,
  map,
  retry,
  switchMap,
  tap
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  NG_TRANS_DEFAULT_LANG,
  NG_TRANS_LOADER,
  NG_TRANS_MAX_RETRY_TOKEN
} from './constants';
import {
  INgTranslationChangeLang,
  INgTranslationLoader,
  INgTranslationOptions,
  INgTranslationParams,
  NgTranslationLangEnum
} from './models';

@Injectable({
  providedIn: 'root'
})
export class NgTranslationService {

  private lang$ = new BehaviorSubject<string>(NgTranslationLangEnum.ZH_CN);

  private loadDefaultOver$ = new BehaviorSubject<boolean>(false);

  private loadLangTrans$ = new Subject<boolean>();

  private retry: number = 5;

  private translations: { [key: string]: Object } = {};

  get lang(): string {
    return this.lang$.value;
  }

  get loadDefaultOver(): boolean {
    return this.loadDefaultOver$.value;
  }

  constructor(
    @Inject(NG_TRANS_DEFAULT_LANG) private transDefaultLang: string,
    @Inject(NG_TRANS_LOADER) private transLoader: INgTranslationLoader,
    @Inject(NG_TRANS_MAX_RETRY_TOKEN) @Optional() private maxRetry: number,
  ) {
    // when the maxRetry is undefined/null, use default setting
    this.retry = this.maxRetry == null ? this.retry : this.maxRetry;

    this.lang$.next(transDefaultLang);
    this.loadDefaultTrans();
  }

  changeLang(lang: string): Observable<INgTranslationChangeLang> {
    const successResult: INgTranslationChangeLang = {
      curLang: lang,
      result: true,
    };
    const failureResult: INgTranslationChangeLang = {
      curLang: this.lang,
      result: false,
    };

    // the lang has been loaded,
    if (this.translations[lang]) {
      this.lang$.next(lang);
      return of(successResult);
    }

    // there is no lang loader
    if (!this.transLoader[lang]) {
      timer().subscribe(_ => this.loadLangTrans$.next(false));
      return of(failureResult);
    }

    const oldLang = this.lang;
    this.lang$.next(lang);
    return this.loadLangTrans().pipe(
      switchMap(loadResult => {
        if (loadResult) {
          return of(successResult);
        }
        this.lang$.next(oldLang);
        return of(failureResult);
      })
    );
  }

  handleSentenceWithParams(trans: string, params?: INgTranslationParams): string {
    if (!params) {
      return trans;
    }

    const keys = Object.keys(params);
    if (!keys.length) {
      return trans;
    }

    const keysUUID: { [key: string]: string } = {};
    keys.forEach(key => keysUUID[key] = uuidv4());

    let transTemp = trans;
    keys.forEach(key => {
      transTemp = this.handleSentence(transTemp, `{{${key}}}`, keysUUID[key]);
    });

    trans = transTemp;
    keys.forEach(key => {
      trans = this.handleSentence(trans, keysUUID[key], params[key]);
    });

    return trans;
  }

  translationAsync(key: string, options?: INgTranslationOptions): Observable<string> {
    return this.lang$.pipe(
      switchMap(_ => {
        return this.translations[this.lang]
          ? of({ trans: this.translations[this.lang], result: true })
          : this.loadLangTrans$;
      }),
      map(_ => this.translationSync(key, options))
    );
  }

  translationSync(key: string, options?: INgTranslationOptions): string {
    const finalKey = this.getFinalKey(key, options?.prefix);
    const emptyTrans = options?.returnKeyWhenEmpty === false ? '' : finalKey;
    let trans = get(this.translations[this.lang], finalKey);

    if (!trans) {
      trans = get(this.translations[this.transDefaultLang], finalKey);
    }

    if (!trans) {
      return emptyTrans;
    }

    const params = options?.params;
    trans = this.handleSentenceWithParams(trans, params);

    return trans || emptyTrans;
  }

  subscribeLangChange(): Observable<string> {
    return this.lang$.asObservable();
  }

  subscribeLoadDefaultOverChange(): Observable<boolean> {
    return this.loadDefaultOver ? of(true) : this.loadDefaultOver$.asObservable();
  }

  private getFinalKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}.${key}` : key;
  }

  private handleSentence(str: string, searchStr: string, replaceStr: string): string {
    return str.replace(new RegExp(searchStr, 'g'), replaceStr);
  };

  private loadDefaultTrans(): void {
    this.loadTrans().subscribe(trans => {
      const result = !!trans;
      this.loadDefaultOver$.next(result);
      this.loadDefaultOver$.complete();
      this.loadLangTrans$.next(result);
    });
  }

  private loadLangTrans(): Observable<boolean> {
    return this.loadTrans().pipe(
      map(trans => {
        const result = !!trans;
        this.loadLangTrans$.next(result);
        return result;
      })
    );
  }

  private loadTrans(): Observable<Object | null> {
    const loader = this.transLoader[this.lang];
    if (!loader) {
      return of(null);
    }

    console.log(this.maxRetry);

    const loaderFn: Observable<Object> = isFunction(loader)
      ? of(null).pipe(switchMap(() => from(loader())))
      : of(loader);
    return loaderFn.pipe(
      tap(trans => this.translations[this.lang] = trans),
      retry(5),
      catchError(_ => of(null))
    );
  }

}
