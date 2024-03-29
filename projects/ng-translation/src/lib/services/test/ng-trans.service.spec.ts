import { inject, TestBed } from '@angular/core/testing';
import { filter, switchMap, take } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG, NG_TRANS_LOADER, NG_TRANS_MAX_RETRY } from '../../constants';
import { NgTransLang } from '../../models';
import { translationSyncTestData, transLoader, NgTransTestingModule } from '../../testing';
import { NgTransService } from '../ng-trans.service';

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
              { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLang.ZH_CN, },
              { provide: NG_TRANS_LOADER, useValue: loaderMethodItem.loader },
            ]
          });
          service = TestBed.inject(NgTransService);
        });

        it('#subscribeLoadDefaultOver()', (done) => {
          service.subscribeLoadDefaultOver().pipe(
            take(1),
          ).subscribe(
            result => {
              expect(result).toEqual(true);
              done();
            }
          );
        });

        [
          { lang: NgTransLang.ZH_CN, expect: { changeResult: { curLang: NgTransLang.ZH_CN, result: true }, transResult: '标题  ' } },
          { lang: NgTransLang.EN, expect: { changeResult: { curLang: NgTransLang.EN, result: true }, transResult: 'title  ' } },
          { lang: NgTransLang.AR_EG, expect: { changeResult: { curLang: NgTransLang.ZH_CN, result: false }, transResult: '标题  ' } },
        ].forEach(item => {
          it(`change lang as ${item.lang}`, (done) => {
            service.subscribeLoadDefaultOver().pipe(
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
            { lang: NgTransLang.ZH_CN, expect: NgTransLang.ZH_CN },
            { lang: NgTransLang.EN, expect: NgTransLang.EN },
            { lang: NgTransLang.AR_EG, expect: NgTransLang.ZH_CN },
          ].forEach(item => {
            it(`change lang as ${item.lang}`, (done) => {
              service.subscribeLoadDefaultOver().pipe(
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
    service.changeLangSync(NgTransLang.BG_BG);
    expect(service.changeLang).toHaveBeenCalledTimes(1);
  }));

  describe('#translationSync()', () => {
    let service: NgTransService;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [NgTransTestingModule],
        providers: [
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLang.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.staticLoader },
        ]
      });
      service = TestBed.inject(NgTransService);
    });

    translationSyncTestData.forEach(item => {
      it(item.title, (done) => {
        service.subscribeLoadDefaultOver().pipe(
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
          { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLang.ZH_CN },
          { provide: NG_TRANS_LOADER, useValue: transLoader.dynamicLoader },
        ]
      });
      service = TestBed.inject(NgTransService);
    });

    it('not change lang', (done) => {
      service.subscribeLoadDefaultOver().pipe(
        filter(result => result),
        switchMap(() => service.translationAsync('title')),
      ).pipe(take(1)).subscribe(transContent => {
        expect(transContent).toEqual('标题  ');
        done();
      });
    });

    it('change lang as en', (done) => {
      service.subscribeLoadDefaultOver().pipe(
        filter(result => result),
        switchMap(() => service.changeLang(NgTransLang.EN)),
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
      [NgTransLang.EN_US]: langLoader
    };
    TestBed.configureTestingModule({
      imports: [NgTransTestingModule],
      providers: [
        { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTransLang.EN_US },
        { provide: NG_TRANS_LOADER, useValue: transLoader },
        { provide: NG_TRANS_MAX_RETRY, useValue: 3 },
      ]
    });
    spyOn(transLoader, NgTransLang.EN_US).and.callThrough();
    const service = TestBed.inject(NgTransService);
    service.subscribeLoadDefaultOver().pipe(
      take(1),
    ).subscribe(_ => {
      expect(transLoader[NgTransLang.EN_US]).toHaveBeenCalledTimes(4);
      done();
    });
  });

  it('#getBrowserLang()', inject([NgTransService], (service: NgTransService) => {
    expect(service.getBrowserLang()).toEqual(window.navigator.language);

    spyOnProperty(window.navigator, 'language').and.returnValue(undefined);
    expect(service.getBrowserLang()).toEqual(undefined);

    spyOnProperty(window, 'navigator').and.returnValue(undefined);
    expect(service.getBrowserLang()).toEqual(undefined);
  }));

  it('#getBrowserLangs()', inject([NgTransService], (service: NgTransService) => {
    expect(service.getBrowserLangs()).toEqual(window.navigator.languages);

    spyOnProperty(window.navigator, 'languages').and.returnValue(undefined);
    expect(service.getBrowserLangs()).toEqual(undefined);

    spyOnProperty(window, 'navigator').and.returnValue(undefined);
    expect(service.getBrowserLangs()).toEqual(undefined);
  }));

});
