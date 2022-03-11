import { Pipe, PipeTransform } from '@angular/core';
import { NbValueTypeService } from '@bigbear713/nb-common';
import { INgTransSentencePart, NgTransSentenceItemEnum } from '../models';

@Pipe({
  name: 'sentenceItemType'
})
export class SentenceItemTypePipe implements PipeTransform {

  constructor(private valueType: NbValueTypeService) { }

  transform(value: INgTransSentencePart): number | undefined {
    let type: number | undefined;

    if (this.valueType.isString(value)) {
      type = NgTransSentenceItemEnum.STR;
    } else if (this.valueType.isNumber((value?.index))) {
      type = (Array.isArray(value?.list) && value.list.length)
        ? NgTransSentenceItemEnum.MULTI_COMP
        : NgTransSentenceItemEnum.COMP;
    }

    return type;
  }

}
