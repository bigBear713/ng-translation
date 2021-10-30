import {
    get,
    isFunction
} from 'lodash-es';
import {
    BehaviorSubject,
    from,
    Observable,
    of,
    Subject
} from 'rxjs';
import {
    map,
    retry,
    switchMap,
    tap
} from 'rxjs/operators';

import {
    Inject,
    Injectable
} from '@angular/core';

import {
    NG_TRANS_DEFAULT_LANG,
    NG_TRANS_LOADER
} from './constants';
import {
    INgTranslationLoader,
    NgTranslationLangEnum
} from './models';

@Injectable({
  providedIn: 'root'
})
export class NgTranslationService {

  private lang$ = new BehaviorSubject<string>(NgTranslationLangEnum.ZH_CN);

  private loadDefaultOver$ = new BehaviorSubject<boolean>(false);

  private loadLangTrans$ = new Subject<boolean>();

  private translations: { [key: string]: Object } = {};

  get lang(): string {
    return this.lang$.value;
  }

  get loadDefaultOver(): boolean {
    return this.loadDefaultOver$.value;
  }

  constructor(
    @Inject(NG_TRANS_DEFAULT_LANG) transDefaultLang: string,
    @Inject(NG_TRANS_LOADER) private transLoader: INgTranslationLoader,
  ) {
    this.lang$.next(transDefaultLang);
    this.loadDefaultTrans();
  }

  changeLang(lang: string): Observable<boolean> {
    this.lang$.next(lang);

    if (this.translations[lang]) {
      return of(true);
    }

    if (this.transLoader[lang]) {
      return this.loadLangTrans();
    }

    return of(false);
  }

  translationSync(key: string): string {
    return get(this.translations[this.lang], key);
  }

  translationAsync(key: string): Observable<string> {
    return this.lang$.pipe(
      switchMap(_ => this.translations[this.lang] ? of(true) : this.loadLangTrans$),
      map(_ => this.translationSync(key))
    );
  }

  subscribeLoadDefaultOverChange(): Observable<boolean> {
    return this.loadDefaultOver ? of(true) : this.loadDefaultOver$.asObservable();
  }

  subscribeLangChange(): Observable<string> {
    return this.lang$.asObservable();
  }

  private loadDefaultTrans(): void {
    this.loadTrans().subscribe(trans => {
      const result = !!trans;
      this.loadDefaultOver$.next(result);
      this.loadDefaultOver$.complete();
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

    const loaderFn: Observable<Object> = isFunction(loader) ? from(loader()) : of(loader);
    return loaderFn.pipe(
      tap(trans => this.translations[this.lang] = trans),
      // TODO: will retry 5 times?
      retry(5)
    );
  }

}
