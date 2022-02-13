import { inject, TestBed } from '@angular/core/testing';
import { delay, filter, skip, switchMap, take } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG, NG_TRANS_LOADER } from './constants';
import { INgTranslationParams, NgTranslationLangEnum } from './models';
import { NgTranslationService } from './ng-translation.service';

const loader = {
  dynamicLoader: {
    [NgTranslationLangEnum.EN]: () => import('./tests/localization/en/translations').then(data => data.trans),
    [NgTranslationLangEnum.ZH_CN]: () => import('./tests/localization/zh-CN/translations').then(data => data.trans),
  },
  staticLoader: { [NgTranslationLangEnum.EN]: { title: 'title  ' }, [NgTranslationLangEnum.ZH_CN]: { title: '标题  ' }, }
};

describe('NgTranslationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgTranslationService]
    });
  });

  it('should be created', inject([NgTranslationService], (service: NgTranslationService) => {
    expect(service).toBeTruthy();
  }));

  describe('#changeLang()', () => {
    [
      { title: 'dynamic load language', skipLoadDefaultOverChangeTime: 1, loader: loader.dynamicLoader },
      { title: 'static load language', skipLoadDefaultOverChangeTime: 0, loader: loader.staticLoader },
    ].forEach(loaderMethodItem => {
      describe(loaderMethodItem.title, () => {
        let service: NgTranslationService;
        beforeEach(async () => {
          TestBed.configureTestingModule({
            providers: [
              { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN, },
              { provide: NG_TRANS_LOADER, useValue: loaderMethodItem.loader },
              NgTranslationService,
            ]
          });
          service = TestBed.inject(NgTranslationService);
        });

        it('#subscribeLoadDefaultOverChange()', (done) => {
          service.subscribeLoadDefaultOverChange().pipe(
            skip(loaderMethodItem.skipLoadDefaultOverChangeTime),
            take(1),
          ).subscribe(
            result => {
              expect(result).toEqual(true);
              done();
            }
          );
        });

        [
          { lang: NgTranslationLangEnum.ZH_CN, expect: { changeResult: { curLang: NgTranslationLangEnum.ZH_CN, result: true }, transResult: '标题  ' } },
          { lang: NgTranslationLangEnum.EN, expect: { changeResult: { curLang: NgTranslationLangEnum.EN, result: true }, transResult: 'title  ' } },
          { lang: NgTranslationLangEnum.AR_EG, expect: { changeResult: { curLang: NgTranslationLangEnum.ZH_CN, result: false }, transResult: '标题  ' } },
        ].forEach(item => {
          it(`change lang as ${item.lang}`, (done) => {
            service.subscribeLoadDefaultOverChange().pipe(
              filter(result => result),
              switchMap(() => service.changeLang(item.lang))
            ).pipe(take(1)).subscribe(result => {
              expect(result).toEqual(item.expect.changeResult);
              expect(service.lang).toEqual(item.expect.changeResult.curLang);
              expect(service.translationSync('title')).toEqual(item.expect.transResult);
              done();
            });
          });

        });

        describe('#subscribeLangChange()', () => {
          [
            { lang: NgTranslationLangEnum.ZH_CN, skipTime: 0, expect: NgTranslationLangEnum.ZH_CN },
            { lang: NgTranslationLangEnum.EN, skipTime: 0, expect: NgTranslationLangEnum.EN },
            { lang: NgTranslationLangEnum.AR_EG, skipTime: 0, expect: NgTranslationLangEnum.ZH_CN },
          ].forEach(item => {
            it(`change lang as ${item.lang}`, (done) => {
              service.subscribeLoadDefaultOverChange().pipe(
                filter(result => result),
                switchMap(() => service.changeLang(item.lang)),
                take(1),
              ).subscribe(() => {
                service.subscribeLangChange().pipe(
                  skip(item.skipTime),
                  take(1)
                ).subscribe(lang => {
                  expect(lang).toEqual(item.expect);
                  done();
                });
              });
            });

          });
        });

      });
    });
  });

  describe('#handleSentenceWithParams()', () => {
    const testData: {
      title: string;
      test: { trans: string; params?: INgTranslationParams; };
      expect: { result: string };
    }[] = [
        { title: 'no params', test: { trans: 'test trans', params: undefined, }, expect: { result: 'test trans' } },
        { title: 'empty params', test: { trans: 'test trans', params: {} }, expect: { result: 'test trans' } },
        { title: '2 params', test: { trans: 'a {{p1}} {{p2}}', params: { p1: '123', p2: 'abc' } }, expect: { result: 'a 123 abc' } },
        { title: 'start with params', test: { trans: '{{p1}} and {{p2}}', params: { p1: '123', p2: 'abc' } }, expect: { result: '123 and abc' } },
        { title: 'params are in middle', test: { trans: 'a {{p1}} b {{p2}} c', params: { p1: '123', p2: 'abc' } }, expect: { result: 'a 123 b abc c' }, },
        { title: 'params value is same with param key', test: { trans: '{{p1}}{{p2}}', params: { p1: '{{p2}}', p2: '{{p2}}' } }, expect: { result: '{{p2}}{{p2}}' }, },
        { title: 'err params format:{}', test: { trans: 'test {p1}', params: { p1: '123' } }, expect: { result: 'test {p1}' } },
        { title: 'err params format:{{{}}}', test: { trans: 'test {{{p1}}}', params: { p1: '123' } }, expect: { result: 'test {123}' } },
        { title: 'err params format:[]', test: { trans: 'test [p1]', params: { p1: '123' } }, expect: { result: 'test [p1]' } },
        { title: 'err params format:[[]]', test: { trans: 'test [[p2]]', params: { p2: '123' } }, expect: { result: 'test [[p2]]' } }
      ];
    testData.forEach(item => {
      it(item.title, inject([NgTranslationService], (service: NgTranslationService) => {
        const params: INgTranslationParams | undefined = item.test.params;
        const result = service.handleSentenceWithParams(item.test.trans, params);
        expect(result).toEqual(item.expect.result);
      }));
    });
  });

  describe('#translationSync()', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN },
          {
            provide: NG_TRANS_LOADER,
            useValue: { [NgTranslationLangEnum.ZH_CN]: { prefix: { key: '测试' } }, }
          },
          NgTranslationService,
        ]
      });
    });

    [
      { title: 'options is undefined', test: { key: 'trans.key', options: undefined, }, expect: { result: 'trans.key' }, },
      { title: 'options is {}', test: { key: 'trans.key', options: {}, }, expect: { result: 'trans.key' }, },
      { title: 'returnKeyWhenEmpty is false', test: { key: 'trans.key', options: { returnKeyWhenEmpty: false }, }, expect: { result: '' }, },
      { title: 'returnKeyWhenEmpty is true', test: { key: 'trans.key', options: { returnKeyWhenEmpty: true }, }, expect: { result: 'trans.key' }, },
      { title: 'prefix is "prefix"', test: { key: 'trans.key', options: { prefix: 'prefix' }, }, expect: { result: 'prefix.trans.key' }, },
      { title: 'prefix is "prefix."', test: { key: 'trans.key', options: { prefix: 'prefix.' }, }, expect: { result: 'prefix..trans.key' }, },
      { title: 'prefix is " prefix "', test: { key: 'trans.key', options: { prefix: ' prefix ' }, }, expect: { result: ' prefix .trans.key' }, },
      { title: 'prefix is "prefix"', test: { key: 'key', options: { prefix: 'prefix' }, }, expect: { result: '测试' }, },
    ].forEach(item => {
      it(item.title, inject([NgTranslationService], (service: NgTranslationService) => {
        const result = service.translationSync(item.test.key, item.test.options);
        expect(result).toEqual(item.expect.result);
      }));
    });
  });

  describe('#translationAsync()', () => {
    let service: NgTranslationService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN },
          {
            provide: NG_TRANS_LOADER,
            useValue: loader.dynamicLoader
          },
          NgTranslationService,
        ]
      });
      service = TestBed.inject(NgTranslationService);
    });

    it('not change lang', (done) => {
      service.subscribeLoadDefaultOverChange().pipe(
        filter(result => result),
        switchMap(() => service.translationAsync('title')),
      ).pipe(take(1)).subscribe(transContent => {
        expect(transContent).toEqual('标题  ');
        done();
      });
    });

    it('change lang as en', (done) => {
      service.subscribeLoadDefaultOverChange().pipe(
        filter(result => result),
        switchMap(() => service.changeLang(NgTranslationLangEnum.EN)),
        switchMap(() => service.translationAsync('title')),
      ).pipe(take(1)).subscribe(transContent => {
        expect(transContent).toEqual('title  ');
        done();
      });
    });
  });


});
