import { inject, TestBed } from '@angular/core/testing';
import { filter, skip, switchMap, take } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG, NG_TRANS_LOADER } from '../constants';
import { INgTransParams, NgTransLangEnum } from '../models';
import { NgTransTestingModule } from '../ng-trans-testing.module';
import { handleSentenceWithParamsTestData, translationSyncTestData, transLoader } from '../tests';
import { NgTransService } from './ng-trans.service';

describe('Service: NgTrans', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgTransTestingModule]
    });
  });

  it('should be created', inject([NgTransService], (service: NgTransService) => {
    expect(service).toBeTruthy();
  }));

  describe('#changeLang()', () => {
    [
      { title: 'dynamic load language', skipLoadDefaultOverChangeTime: 1, loader: transLoader.dynamicLoader },
      { title: 'static load language', skipLoadDefaultOverChangeTime: 0, loader: transLoader.staticLoader },
    ].forEach(loaderMethodItem => {
      describe(loaderMethodItem.title, () => {
        let service: NgTransService;
        beforeEach(async () => {
          TestBed.configureTestingModule({
            imports: [NgTransTestingModule],
            providers: [
              { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLangEnum.ZH_CN, },
              { provide: NG_TRANS_LOADER, useValue: loaderMethodItem.loader },
            ]
          });
          service = TestBed.inject(NgTransService);
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
          { lang: NgTransLangEnum.ZH_CN, expect: { changeResult: { curLang: NgTransLangEnum.ZH_CN, result: true }, transResult: '标题  ' } },
          { lang: NgTransLangEnum.EN, expect: { changeResult: { curLang: NgTransLangEnum.EN, result: true }, transResult: 'title  ' } },
          { lang: NgTransLangEnum.AR_EG, expect: { changeResult: { curLang: NgTransLangEnum.ZH_CN, result: false }, transResult: '标题  ' } },
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
            { lang: NgTransLangEnum.ZH_CN, expect: NgTransLangEnum.ZH_CN },
            { lang: NgTransLangEnum.EN, expect: NgTransLangEnum.EN },
            { lang: NgTransLangEnum.AR_EG, expect: NgTransLangEnum.ZH_CN },
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
      it(item.title, inject([NgTransService], (service: NgTransService) => {
        const params: INgTransParams | undefined = item.test.params;
        const result = service.handleSentenceWithParams(item.test.trans, params);
        expect(result).toEqual(item.expect.result);
      }));
    });
  });

  describe('#translationSync()', () => {
    let service: NgTransService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [NgTransTestingModule],
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLangEnum.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.staticLoader },
        ]
      });
      service = TestBed.inject(NgTransService);
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
    let service: NgTransService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [NgTransTestingModule],
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLangEnum.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.dynamicLoader },
        ]
      });
      service = TestBed.inject(NgTransService);
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
        switchMap(() => service.changeLang(NgTransLangEnum.EN)),
        switchMap(() => service.translationAsync('title')),
      ).pipe(take(1)).subscribe(transContent => {
        expect(transContent).toEqual('title  ');
        done();
      });
    });
  });

});
