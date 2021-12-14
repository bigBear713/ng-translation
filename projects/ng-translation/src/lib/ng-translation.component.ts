import {
  isNumber,
  isString
} from 'lodash-es';
import { Subject } from 'rxjs';
import {
  switchMap,
  takeUntil
} from 'rxjs/operators';

import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef
} from '@angular/core';

import {
  INgTranslationOptions,
  INgTranslationParams
} from './models';
import { NgTranslationSentenceItemEnum } from './models/ng-translation-sentence-item.enum';
import { INgTranslationSentencePart } from './models/ng-translation-sentence-part.interface';
import { NgTranslationService } from './ng-translation.service';

@Component({
  selector: 'ng-translation',
  templateUrl: './ng-translation.component.html',
  styles: [
  ]
})
export class NgTranslationComponent implements OnChanges, OnInit, OnDestroy {

  @Input()
  components: TemplateRef<any>[] = [];

  @Input()
  key: string = '';

  @Input()
  options: INgTranslationOptions = {};

  params: INgTranslationParams | undefined;

  sentenceList: INgTranslationSentencePart[] = [];

  SentenceItemEnum = NgTranslationSentenceItemEnum;

  private destroy$ = new Subject<void>();

  private originTrans: string = '';

  constructor(
    private translationService: NgTranslationService
  ) {
    this.subscribeLangChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.originTrans = this.translationService.translationSync(this.key, this.options);
    this.reRender();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getSentenceItemType(item: INgTranslationSentencePart): number | undefined {
    let type: number | undefined;

    if (isString(item)) {
      type = NgTranslationSentenceItemEnum.STR;
    } else if (isNumber((item?.index))) {
      type = (Array.isArray(item?.list) && item.list.length)
        ? NgTranslationSentenceItemEnum.MULTI_COMP
        : NgTranslationSentenceItemEnum.COMP;
    }

    return type;
  }

  isString(content: INgTranslationSentencePart): boolean {
    return isString(content);
  }

  private reRender(): void {
    this.params = this.options?.params;

    let trans = this.originTrans;
    this.sentenceList = this.handleTrans(trans);
  }

  private handleTrans(trans: string): INgTranslationSentencePart[] {
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

  private subscribeLangChange(): void {
    this.translationService.subscribeLangChange().pipe(
      switchMap(_ => this.translationService.translationAsync(this.key, this.options)),
      takeUntil(this.destroy$)
    ).subscribe(latestValue => {
      // TODO: 为什么会触发两次，change lang的时候
      if (!latestValue || latestValue === this.originTrans) {
        return;
      }
      this.originTrans = latestValue;
      this.reRender();
    });
  }

}
