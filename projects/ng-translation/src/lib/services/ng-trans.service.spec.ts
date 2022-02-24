import { inject, TestBed } from '@angular/core/testing';
import { filter, skip, switchMap, take, tap } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG, NG_TRANS_LOADER, NG_TRANS_MAX_RETRY_TOKEN } from '../constants';
import { NgTransLangEnum } from '../models';
import { NgTransTestingModule } from '../ng-trans-testing.module';
import { translationSyncTestData, transLoader } from '../tests';
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
      { title: 'dynamic load language', loader: transLoader.dynamicLoader },
      { title: 'static load language', loader: transLoader.staticLoader },
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
            ).pipe().subscribe(result => {
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
              ).subscribe(() => {
                service.subscribeLangChange().pipe().subscribe(lang => {
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

  it('#changeLangSync()', inject([NgTransService], (service: NgTransService) => {
    spyOn(service, 'changeLang').and.callThrough();
    service.changeLangSync(NgTransLangEnum.BG_BG);
    expect(service.changeLang).toHaveBeenCalledTimes(1);
  }));

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

  it('when failure to load default lang', (done) => {
    const langLoader = () => Promise.reject();
    const transLoader = {
      [NgTransLangEnum.EN_US]: langLoader
    };
    TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      providers: [
        { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLangEnum.EN_US },
        { provide: NG_TRANS_LOADER, useValue: transLoader },
        { provide: NG_TRANS_MAX_RETRY_TOKEN, useValue: 3 },
      ]
    });
    spyOn(transLoader, NgTransLangEnum.EN_US).and.callThrough();
    const service = TestBed.inject(NgTransService);
    service.subscribeLoadDefaultOverChange().pipe(
      take(1),
    ).subscribe(_ => {
      expect(transLoader[NgTransLangEnum.EN_US]).toHaveBeenCalledTimes(4);
      done();
    });
  });

});
