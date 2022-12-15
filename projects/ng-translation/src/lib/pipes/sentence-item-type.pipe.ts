import { Pipe, PipeTransform } from '@angular/core';
import { NbValueTypeService } from '@bigbear713/nb-common';
import { INgTransSentencePart, NgTransSentenceItem } from '../models';

@Pipe({
  name: 'sentenceItemType'
})
export class SentenceItemTypePipe implements PipeTransform {

  constructor(private valueType: NbValueTypeService) { }

  transform(value: INgTransSentencePart): number | undefined {
    let type: number | undefined;

    if (this.valueType.isString(value)) {
      type = NgTransSentenceItem.STR;
    } else if (this.valueType.isNumber((value?.index))) {
      type = (Array.isArray(value?.list) && value.list.length)
        ? NgTransSentenceItem.MULTI_COMP
        : NgTransSentenceItem.COMP;
    }

    return type;
  }

}
