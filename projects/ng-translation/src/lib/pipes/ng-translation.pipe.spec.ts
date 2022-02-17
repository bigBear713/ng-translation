import { TestBed } from '@angular/core/testing';
import { filter, take } from 'rxjs/operators';
import { NG_TRANS_DEFAULT_LANG } from '../constants/ng-translation-default-lang.token';
import { NG_TRANS_LOADER } from '../constants/ng-translation-loader.token';
import { NgTranslationLangEnum } from '../models/ng-translation-lang.enum';
import { NgTranslationTestingModule } from '../ng-translation-testing.module';
import { NgTranslationService } from '../services/ng-translation.service';
import { translationSyncTestData, transLoader } from '../tests';
import { NgTranslationPipe } from './ng-translation.pipe';

describe('Pipe: NgTranslatione', () => {
  let transService: NgTranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTranslationTestingModule],
      declarations: [],
      providers: [
        { provide: NG_TRANS_DEFAULT_LANG, useValue: NgTranslationLangEnum.ZH_CN, },
        { provide: NG_TRANS_LOADER, useValue: transLoader.dynamicLoader },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    transService = TestBed.inject(NgTranslationService);
  });

  it('create an instance', () => {
    let pipe = new NgTranslationPipe(transService);
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    const testData1 = [...translationSyncTestData];
    testData1.pop();
    translationSyncTestData.map((item, index) => {
      const expect = {
        resultZHCN: item.expect.result,
        resultEN: item.expect.result,
      };
      if (index + 1 === translationSyncTestData.length) {
        expect.resultEN = 'hello world';
        expect.resultZHCN = '你好，世界';
      }
      return {
        ...item,
        expect,
      };
    }).forEach(item => {
      it(item.title, (done) => {
        transService.subscribeLoadDefaultOverChange().pipe(
          filter(result => result),
          take(1),
        ).subscribe(() => {
          const verifyResult = (expectResult: string) => {
            const result = pipe.transform(item.test.key, item.test.options);
            expect(result).toEqual(expectResult);
          };
          const pipe = new NgTranslationPipe(transService);
          verifyResult(item.expect.resultZHCN);

          transService.changeLang(NgTranslationLangEnum.EN).pipe(take(1)).subscribe(() => {
            verifyResult(item.expect.resultEN);
            done();
          });
        });
      });
    });

  });

});
