import { TestBed } from '@angular/core/testing';
import { INgTranslationParams, NgTranslationLangEnum } from './models';

import { NgTranslationService } from './ng-translation.service';

const zhCNKey = NgTranslationLangEnum.ZH_CN;
const enKey = NgTranslationLangEnum.EN;;

describe('NgTranslationService', () => {
  let service: NgTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#handleSentenceWithParams()', () => {
    [
      {
        title: 'no params',
        test: { trans: 'test trans', params: undefined, },
        expect: { result: 'test trans' },
      },
      {
        title: 'empty params',
        test: { trans: 'test trans', params: {} as INgTranslationParams, },
        expect: { result: 'test trans' },
      },
      {
        title: '1 params',
        test: { trans: 'test trans {{testParam}}', params: { testParam: '123' } as INgTranslationParams, },
        expect: { result: 'test trans 123' },
      },
      {
        title: '2 params',
        test: { trans: 'test trans {{testParam}} {{testParam2}}', params: { testParam: '123', testParam2: 'abc' } as INgTranslationParams, },
        expect: { result: 'test trans 123 abc' },
      },
      {
        title: 'start with params',
        test: { trans: '{{testParam}} test trans {{testParam2}}', params: { testParam: '123', testParam2: 'abc' } as INgTranslationParams, },
        expect: { result: '123 test trans abc' },
      },
      {
        title: 'params are in middle',
        test: { trans: 'test {{testParam}} trans {{testParam2}} test', params: { testParam: '123', testParam2: 'abc' } as INgTranslationParams, },
        expect: { result: 'test 123 trans abc test' },
      },
      {
        title: 'err params format:{}',
        test: { trans: 'test {testParam}', params: { testParam: '123' } as INgTranslationParams, },
        expect: { result: 'test {testParam}' },
      },
      {
        title: 'err params format:[]',
        test: { trans: 'test [testParam]', params: { testParam: '123' } as INgTranslationParams, },
        expect: { result: 'test [testParam]' },
      },
      {
        title: 'err params format:[[]]',
        test: { trans: 'test [[testParam]]', params: { testParam: '123' } as INgTranslationParams, },
        expect: { result: 'test [[testParam]]' },
      }
    ].forEach(item => {
      it(item.title, () => {
        const result = service.handleSentenceWithParams(item.test.trans, item.test.params);
        expect(result).toEqual(item.expect.result);
      });
    });
  });

  describe('#translationSync()', () => {
    [
      {
        title: 'returnKeyWhenEmpty is undefined - 1',
        test: { key: 'trans.key', options: undefined, getService: () => service },
        expect: { result: 'trans.key' },
      },
      {
        title: 'returnKeyWhenEmpty is undefined - 2',
        test: { key: 'trans.key', options: {}, getService: () => service },
        expect: { result: 'trans.key' },
      },
      {
        title: 'returnKeyWhenEmpty is false',
        test: { key: 'trans.key', options: { returnKeyWhenEmpty: false }, getService: () => service },
        expect: { result: '' },
      },
      {
        title: 'returnKeyWhenEmpty is true',
        test: { key: 'trans.key', options: { returnKeyWhenEmpty: true }, getService: () => service },
        expect: { result: 'trans.key' },
      },
      {
        title: 'prefix is undefined',
        test: { key: 'trans.key', options: {}, getService: () => service },
        expect: { result: 'trans.key' },
      },
      {
        title: 'prefix is "prefix"',
        test: { key: 'trans.key', options: { prefix: 'prefix' }, getService: () => service },
        expect: { result: 'prefix.trans.key' },
      },
      {
        title: 'prefix is "prefix."',
        test: { key: 'trans.key', options: { prefix: 'prefix.' }, getService: () => service },
        expect: { result: 'prefix..trans.key' },
      },
      {
        title: 'prefix is " prefix "',
        test: { key: 'trans.key', options: { prefix: ' prefix ' }, getService: () => service },
        expect: { result: ' prefix .trans.key' },
      },
      {
        title: 'prefix is "prefix"',
        test: { key: 'key', options: { prefix: 'prefix' }, getService: () => new NgTranslationService(zhCNKey, { [zhCNKey]: { prefix: { key: '测试' } } }, 5) },
        expect: { result: '测试' },
      },
      {
        title: 'prefix is "prefix"',
        test: {
          key: 'key', options: { prefix: 'prefix' }, getService: () => {
            const testService = new NgTranslationService(zhCNKey, { [zhCNKey]: { prefix: { key: '测试' } }, [enKey]: { prefix: { key: 'test' } } }, 5);
            return testService;
          }
        },
        expect: { result: '测试' },
      }
    ].forEach(item => {
      it(item.title, () => {
        const testService = item.test.getService();
        const result = testService.translationSync(item.test.key, item.test.options);
        expect(result).toEqual(item.expect.result);
      });
    });
  });


});
