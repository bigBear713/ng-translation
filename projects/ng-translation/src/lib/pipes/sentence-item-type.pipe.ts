import { Pipe, PipeTransform } from '@angular/core';
import { isNumber, isString } from 'lodash-es';
import { NgTransSentenceItemEnum } from '../models/ng-trans-sentence-item.enum';
import { INgTransSentencePart } from '../models/ng-trans-sentence-part.interface';

@Pipe({
  name: 'sentenceItemType'
})
export class SentenceItemTypePipe implements PipeTransform {

  transform(value: INgTransSentencePart): number | undefined {
    let type: number | undefined;

    if (isString(value)) {
      type = NgTransSentenceItemEnum.STR;
    } else if (isNumber((value?.index))) {
      type = (Array.isArray(value?.list) && value.list.length)
        ? NgTransSentenceItemEnum.MULTI_COMP
        : NgTransSentenceItemEnum.COMP;
    }

    return type;
  }

}
