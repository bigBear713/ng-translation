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
  skipWhile,
  switchMap,
  tap
} from 'rxjs/operators';

import {
  Inject,
  Injectable,
  Optional
} from '@angular/core';

import {
  deprecatedTip,
  NG_TRANS_DEFAULT_LANG,
  NG_TRANS_LOADER,
  NG_TRANS_MAX_RETRY,
  WARN_DEPRECATED
} from '../constants';
import {
  INgTransChangeLang,
  INgTransLoader,
  INgTransOptions,
  NgTransLang
} from '../models';
import { NgTransToolsService } from './ng-trans-tools.service';

@Injectable({ providedIn: 'root' })
export class NgTransService {
  private lang$ = new BehaviorSubject<string>(NgTransLang.ZH_CN);

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
    @Inject(NG_TRANS_LOADER) @Optional() private transLoader: INgTransLoader,
    @Inject(NG_TRANS_MAX_RETRY) @Optional() private maxRetry: number,
    @Inject(WARN_DEPRECATED) @Optional() warnDeprecated: boolean,
    private transToolsService: NgTransToolsService,
  ) {
    if (warnDeprecated !== false) {
      console.warn(deprecatedTip);
    }

    // if the maxRetry is undefined/null, use default settings,
    // so can set the retry valus as 0 to cancel retry action.
    this.retry = this.maxRetry == null ? this.retry : this.maxRetry;

    this.transLoader = this.transLoader || {};

    this.lang$.next(transDefaultLang || NgTransLang.ZH_CN);
    this.loadDefaultTrans();
  }

  changeLang(lang: string): Observable<INgTransChangeLang> {
    const successResult: INgTransChangeLang = {
      curLang: lang,
      result: true,
    };
    const failureResult: INgTransChangeLang = {
      curLang: this.lang,
      result: false,
    };

    // the lang has been loaded,
    if (this.translations[lang]) {
      this.lang$.next(lang);
      return of(successResult);
    }

    // there is no any lang loader
    if (!this.transLoader[lang]) {
      timer().subscribe(_ => this.loadLangTrans$.next(false));
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

  changeLangSync(lang: string): void {
    this.changeLang(lang).subscribe();
  }

  getBrowserLang(): string | undefined {
    if (!this.transToolsService.checkNavigator()) {
      return undefined;
    }
    return window?.navigator?.language;
  }

  getBrowserLangs(): readonly string[] | undefined {
    if (!this.transToolsService.checkNavigator()) {
      return undefined;
    }
    return window?.navigator?.languages;
  }

  translationAsync(key: string, options?: INgTransOptions): Observable<string> {
    return this.lang$.pipe(
      switchMap(_ => {
        return this.translations[this.lang]
          ? of({ trans: this.translations[this.lang], result: true })
          : this.loadLangTrans$;
      }),
      map(_ => this.translationSync(key, options))
    );
  }

  translationSync(key: string, options?: INgTransOptions): string {
    const finalKey = this.transToolsService.getFinalKey(key, options?.prefix);
    const emptyTrans = options?.returnKeyWhenEmpty === false ? '' : finalKey;
    let trans = get(this.translations[this.lang], finalKey);

    if (!trans) {
      trans = get(this.translations[this.transDefaultLang], finalKey);
    }

    if (!trans) {
      return emptyTrans;
    }

    const params = options?.params;
    trans = this.transToolsService.handleSentenceWithParams(trans, params);

    return trans || emptyTrans;
  }

  subscribeLangChange(): Observable<string> {
    return this.lang$.asObservable();
  }

  subscribeLoadDefaultOver(): Observable<boolean> {
    return this.loadDefaultOver
      ? of(true)
      : this.loadDefaultOver$.asObservable().pipe(
        // the loadDefaultOver$ is BehaviorSubject, 
        // so the user will get a value immediately when subscribe it, 
        // but it doesn't make sense, so here will skip it
        skipWhile((result, index) => (!result && (index === 0)))
      );
  }

  private loadDefaultTrans(): void {
    this.loadTrans(this.lang).pipe(
      map(trans => !!trans),
    ).subscribe(result => {
      this.loadDefaultOver$.next(result);
      this.loadDefaultOver$.complete();
      
      this.loadLangTrans$.next(result);
    });
  }

  private loadLangTrans(lang: string): Observable<boolean> {
    return this.loadTrans(lang).pipe(
      map(trans => !!trans),
      tap(result => this.loadLangTrans$.next(result))
    );
  }

  private loadTrans(lang: string): Observable<Object | null> {
    const loader = this.transLoader[lang];
    if (!loader) {
      return of(null);
    }

    const loaderFn: Observable<Object> = isFunction(loader)
      // switch map as load lang observable, 
      // so it will retry when failure to load the lang content
      ? of(null).pipe(switchMap(() => (from(loader()) as Observable<Object>)))
      : of(loader);
    return loaderFn.pipe(
      tap(trans => this.translations[lang] = trans),
      retry(this.retry),
      catchError(_ => of(null))
    );
  }

}
