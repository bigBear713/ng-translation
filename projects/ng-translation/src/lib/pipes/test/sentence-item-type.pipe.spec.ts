import { TestBed } from '@angular/core/testing';
import { NbValueTypeService } from '@bigbear713/nb-common';
import { isString } from 'lodash-es';
import { INgTransSentencePart, NgTransSentenceItemEnum } from '../../models';
import { SentenceItemTypePipe } from '../sentence-item-type.pipe';

describe('Pipe: SentenceItemTypee', () => {
  let pipe: SentenceItemTypePipe;

  beforeEach(() => {
    const valueType = TestBed.inject(NbValueTypeService);
    pipe = new SentenceItemTypePipe(valueType);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('#transform()', () => {
    [
      { params: 'strContent', expect: NgTransSentenceItemEnum.STR },
      { params: { index: 0, content: 'strContent', list: [] }, expect: NgTransSentenceItemEnum.COMP },
      { params: { index: 0, content: '<0>str</0>', list: [{ index: 0, content: 'str', list: [] }] }, expect: NgTransSentenceItemEnum.MULTI_COMP },
      { params: { index: undefined, content: 'strContent', list: [] } as unknown as INgTransSentencePart, expect: undefined },
      { params: { index: undefined, content: 'strContent', list: undefined } as unknown as INgTransSentencePart, expect: undefined },
    ].forEach(item => {
      it(`the params is ${isString(item.params) ? item.params : JSON.stringify(item.params)}`, () => {
        const type = pipe.transform(item.params);
        expect(type).toEqual(item.expect);
      });
    });
  });

});
