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
    @Inject(NG_TRANS_DEFAULT_LANG) @Optional() private transDefaultLang: string,
    @Inject(NG_TRANS_LOADER) @Optional() private transLoader: INgTranslationLoader,
    @Inject(NG_TRANS_MAX_RETRY_TOKEN) @Optional() private maxRetry: number,
  ) {
    // if the maxRetry is undefined/null, use default setting,
    // so can set the retry valus as 0 to cancel retry action.
    this.retry = this.maxRetry == null ? this.retry : this.maxRetry;

    this.transLoader = this.transLoader || {};

    this.lang$.next(transDefaultLang || NgTranslationLangEnum.ZH_CN);
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
      return of(successResult);
    }

    // there is no any lang loader
    if (!this.transLoader[lang]) {
      timer().subscribe(_ => this.loadLangTrans$.next(false));
      this.lang$.next(this.lang);
      return of(failureResult);
    }

    return this.loadLangTrans(lang).pipe(
      switchMap(loadResult => {
        let curLang = this.lang;
        let result = failureResult;
        if (loadResult) {
          curLang = lang;
          result = successResult;
        }
        this.lang$.next(curLang);
        return of(result);
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

    const keysUUID = keys.reduce(
      (pre: { [key: string]: string }, key) => {
        pre[key] = uuidv4();
        return pre;
      },
      {}
    );

    let transTemp = trans;
    // first, replace the param keys as uuid keys
    keys.forEach(key => {
      transTemp = this.handleSentence(transTemp, `{{${key}}}`, keysUUID[key]);
    });

    trans = transTemp;
    // then, replace the uuid keys as params value,
    // so the value will not be wrong when the params value is same with other param value
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
    this.loadTrans(this.lang).subscribe(trans => {
      const result = !!trans;
      this.loadDefaultOver$.next(result);
      this.loadDefaultOver$.complete();
      this.loadLangTrans$.next(result);
    });
  }

  private loadLangTrans(lang: string): Observable<boolean> {
    return this.loadTrans(lang).pipe(
      map(trans => {
        const result = !!trans;
        this.loadLangTrans$.next(result);
        return result;
      })
    );
  }

  private loadTrans(lang: string): Observable<Object | null> {
    const loader = this.transLoader[lang];
    if (!loader) {
      return of(null);
    }

    const loaderFn: Observable<Object> = isFunction(loader)
      // switch map as load lang observable, so it will retry when failure to load the lang content
      ? of(null).pipe(switchMap(() => from(loader())))
      : of(loader);
    return loaderFn.pipe(
      tap(trans => this.translations[lang] = trans),
      retry(this.retry),
      catchError(_ => of(null))
    );
  }

}
