import { Subject } from 'rxjs';
import {
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import {
  INgTransOptions,
  INgTransParams,
  NgTransSentenceItem,
  INgTransSentencePart
} from '../../models';
import { NgTransService, NgTransToolsService } from '../../services';
import { deprecatedTip, WARN_DEPRECATED } from '../../constants';

@Component({
  selector: 'ng-trans',
  templateUrl: './ng-trans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTransComponent implements OnChanges, OnDestroy {

  @Input()
  components: TemplateRef<{ content: string | TemplateRef<any>; list?: INgTransSentencePart[] }>[] = [];

  @Input()
  key: string = '';

  @Input()
  options: INgTransOptions = {};

  params: INgTransParams | undefined;

  sentenceList: INgTransSentencePart[] = [];

  SentenceItemEnum = NgTransSentenceItem;

  private destroy$ = new Subject<void>();

  private originTrans: string = '';

  constructor(
    @Inject(WARN_DEPRECATED) @Optional() warnDeprecated: boolean,
    private changeDR: ChangeDetectorRef,
    private transToolsService: NgTransToolsService,
    private transService: NgTransService,
  ) {
    this.subscribeLangChange();

    if (warnDeprecated !== false) {
      console.warn(deprecatedTip);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { key, options } = changes;
    if (key || options) {
      this.originTrans = this.transService.translationSync(this.key, this.options);
      this.reRender();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private reRender(): void {
    this.params = this.options?.params;

    const trans = this.originTrans;
    this.sentenceList = this.transToolsService.handleTrans(trans);

    this.changeDR.markForCheck();
  }

  private subscribeLangChange(): void {
    this.transService.subscribeLangChange().pipe(
      switchMap(_ => this.transService.translationAsync(this.key, this.options)),
      takeUntil(this.destroy$)
    ).subscribe(latestValue => {
      this.originTrans = latestValue;
      this.reRender();
    });
  }

}
