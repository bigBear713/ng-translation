import { Injectable } from '@angular/core';
import { isString } from 'lodash-es';
import { INgTranslationSentencePart } from '../models/ng-translation-sentence-part.interface';

@Injectable({
  providedIn: 'root'
})
export class NgTranslationCoreService {

  constructor() { }

  getFinalKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}.${key}` : key;
  }

  handleSentence(str: string, searchStr: string, replaceStr: string): string {
    return str.replace(new RegExp(searchStr, 'g'), replaceStr);
  };

  handleTrans(trans: string): INgTranslationSentencePart[] {
    const sentenceList: INgTranslationSentencePart[] = [];
    while (trans.length) {
      const firstStartFlagIndex = trans.search(/<\d+>/);
      if (firstStartFlagIndex > 0) {
        const contentBeforeFirstComp = trans.slice(0, firstStartFlagIndex);
        sentenceList.push(contentBeforeFirstComp);
      }

      const handleResult = this.handleCompStr(trans);
      if (isString(handleResult)) {
        sentenceList.push(handleResult);
        trans = '';
      } else {
        sentenceList.push({
          index: handleResult.index,
          content: handleResult.content,
          list: handleResult.list,
        });
        trans = handleResult.otherContent;
      }
    }
    return sentenceList;
  }

  private handleCompStr(content: string) {
    const startFlagIndex = content.search(/<\d+>/);
    if (startFlagIndex === -1) {
      return content;
    }

    let list: INgTranslationSentencePart[] = [];
    const startFlagEndIndex = content.indexOf('>', startFlagIndex);
    const comIndex = Number(content.slice(startFlagIndex + 1, startFlagEndIndex));

    const endFlag = `</${comIndex}>`;
    const endFlagIndex = content.indexOf(endFlag);
    const comContent = content.slice(startFlagEndIndex + 1, endFlagIndex);

    if (comContent.search(/<\d+>/) > -1) {
      list = this.handleTrans(comContent);
    }

    const otherContent = content.slice(endFlagIndex + endFlag.length, content.length);

    return {
      index: comIndex,
      content: comContent,
      list,
      otherContent,
    };
  }

}
