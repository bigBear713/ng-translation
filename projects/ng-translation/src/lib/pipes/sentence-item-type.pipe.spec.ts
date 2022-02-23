import { isString } from 'lodash-es';
import { NgTransSentenceItemEnum } from '../models/ng-trans-sentence-item.enum';
import { INgTransSentencePart } from '../models/ng-trans-sentence-part.interface';
import { SentenceItemTypePipe } from './sentence-item-type.pipe';

describe('Pipe: SentenceItemTypee', () => {
  let pipe: SentenceItemTypePipe;

  beforeEach(() => {
    pipe = new SentenceItemTypePipe();
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