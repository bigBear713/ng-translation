import { inject, TestBed } from '@angular/core/testing';
import { filter, skip, switchMap, take } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG, NG_TRANS_LOADER } from '../constants';
import { INgTranslationParams, NgTranslationLangEnum } from '../models';
import { NgTranslationTestingModule } from '../ng-translation-testing.module';
import { handleSentenceWithParamsTestData, translationSyncTestData, transLoader } from '../tests';
import { NgTranslationService } from './ng-translation.service';

describe('Service: NgTranslation', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgTranslationTestingModule]
    });
  });

  it('should be created', inject([NgTranslationService], (service: NgTranslationService) => {
    expect(service).toBeTruthy();
  }));

  describe('#changeLang()', () => {
    [
      { title: 'dynamic load language', skipLoadDefaultOverChangeTime: 1, loader: transLoader.dynamicLoader },
      { title: 'static load language', skipLoadDefaultOverChangeTime: 0, loader: transLoader.staticLoader },
    ].forEach(loaderMethodItem => {
      describe(loaderMethodItem.title, () => {
        let service: NgTranslationService;
        beforeEach(async () => {
          TestBed.configureTestingModule({
            imports: [NgTranslationTestingModule],
            providers: [
              { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN, },
              { provide: NG_TRANS_LOADER, useValue: loaderMethodItem.loader },
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
            { lang: NgTranslationLangEnum.ZH_CN, expect: NgTranslationLangEnum.ZH_CN },
            { lang: NgTranslationLangEnum.EN, expect: NgTranslationLangEnum.EN },
            { lang: NgTranslationLangEnum.AR_EG, expect: NgTranslationLangEnum.ZH_CN },
          ].forEach(item => {
            it(`change lang as ${item.lang}`, (done) => {
              service.subscribeLoadDefaultOverChange().pipe(
                filter(result => result),
                switchMap(() => service.changeLang(item.lang)),
                take(1),
              ).subscribe(() => {
                service.subscribeLangChange().pipe(
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
    handleSentenceWithParamsTestData.forEach(item => {
      it(item.title, inject([NgTranslationService], (service: NgTranslationService) => {
        const params: INgTranslationParams | undefined = item.test.params;
        const result = service.handleSentenceWithParams(item.test.trans, params);
        expect(result).toEqual(item.expect.result);
      }));
    });
  });

  describe('#translationSync()', () => {
    let service: NgTranslationService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [NgTranslationTestingModule],
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.staticLoader },
        ]
      });
      service = TestBed.inject(NgTranslationService);
    });

    translationSyncTestData.forEach(item => {
      it(item.title, (done) => {
        service.subscribeLoadDefaultOverChange().pipe(
          filter(result => result),
          take(1),
        ).subscribe(
          () => {
            const result = service.translationSync(item.test.key, item.test.options);
            expect(result).toEqual(item.expect.result);
            done();
          }
        );
      });
    });
  });

  describe('#translationAsync()', () => {
    let service: NgTranslationService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [NgTranslationTestingModule],
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.dynamicLoader },
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
