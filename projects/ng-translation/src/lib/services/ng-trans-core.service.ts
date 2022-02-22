import { Injectable } from '@angular/core';
import { isString } from 'lodash-es';
import { INgTransParams } from '../models/ng-trans-params.interface';
import { INgTransSentencePart } from '../models/ng-trans-sentence-part.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class NgTransCoreService {

  constructor() { }

  getFinalKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}.${key}` : key;
  }

  handleSentence(str: string, searchStr: string, replaceStr: string): string {
    return str.replace(new RegExp(searchStr, 'g'), replaceStr);
  };

  handleSentenceWithParams(trans: string, params?: INgTransParams): string {
    if (!params) {
      return trans;
    }

    const keys = Object.keys(params);
    if (!keys.length) {
      return trans;
    }

    const keysUUID = keys.reduce(
      (pre: { [key: string]: string }, key) => {
        pre[key] = uuidv4();
        return pre;
      },
      {}
    );

    let transTemp = trans;
    // first, replace the param keys as uuid keys
    keys.forEach(key => {
      transTemp = this.handleSentence(transTemp, `{{${key}}}`, keysUUID[key]);
    });

    trans = transTemp;
    // then, replace the uuid keys as params value,
    // so the value will not be wrong when the params value is same with other param value
    keys.forEach(key => {
      trans = this.handleSentence(trans, keysUUID[key], params[key]);
    });

    return trans;
  }

  handleTrans(trans: string): INgTransSentencePart[] {
    const sentenceList: INgTransSentencePart[] = [];
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

    let list: INgTransSentencePart[] = [];
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
