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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
} from '../../models';
import { NgTranslationSentenceItemEnum } from '../../models/ng-translation-sentence-item.enum';
import { INgTranslationSentencePart } from '../../models/ng-translation-sentence-part.interface';
import { NgTranslationService } from '../../services/ng-translation.service';
import { NgTranslationCoreService } from '../../services/ng-translation-core.service';

@Component({
  selector: 'ng-translation',
  templateUrl: './ng-translation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private changeDR: ChangeDetectorRef,
    private transCoreService: NgTranslationCoreService,
    private translationService: NgTranslationService,
  ) {
    this.subscribeLangChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { key, options } = changes;
    if (key || options) {
      this.originTrans = this.translationService.translationSync(this.key, this.options);
      this.reRender();
    }
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

  private reRender(): void {
    this.params = this.options?.params;

    const trans = this.originTrans;
    this.sentenceList = this.transCoreService.handleTrans(trans);

    this.changeDR.markForCheck();
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
