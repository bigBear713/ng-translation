import { Subject } from 'rxjs';
import {
  switchMap,
  takeUntil,
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
  TemplateRef,
} from '@angular/core';

import {
  INgTransOptions,
  INgTransParams
} from '../../models';
import { NgTransSentenceItemEnum } from '../../models/ng-trans-sentence-item.enum';
import { INgTransSentencePart } from '../../models/ng-trans-sentence-part.interface';
import { NgTransService } from '../../services/ng-trans.service';
import { NgTransCoreService } from '../../services/ng-trans-core.service';

@Component({
  selector: 'ng-trans',
  templateUrl: './ng-trans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class NgTransComponent implements OnChanges, OnInit, OnDestroy {

  @Input()
  components: TemplateRef<{ content: string | TemplateRef<any>; list?: INgTransSentencePart[] }>[] = [];

  @Input()
  key: string = '';

  @Input()
  options: INgTransOptions = {};

  params: INgTransParams | undefined;

  sentenceList: INgTransSentencePart[] = [];

  SentenceItemEnum = NgTransSentenceItemEnum;

  private destroy$ = new Subject<void>();

  private originTrans: string = '';

  constructor(
    private changeDR: ChangeDetectorRef,
    private transCoreService: NgTransCoreService,
    private transService: NgTransService,
  ) {
    this.subscribeLangChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { key, options } = changes;
    if (key || options) {
      this.originTrans = this.transService.translationSync(this.key, this.options);
      this.reRender();
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private reRender(): void {
    this.params = this.options?.params;

    const trans = this.originTrans;
    this.sentenceList = this.transCoreService.handleTrans(trans);

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
