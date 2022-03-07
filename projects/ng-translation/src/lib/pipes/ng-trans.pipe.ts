import { Subject } from 'rxjs';
import {
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import {
  ChangeDetectorRef,
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransOptions } from '../models';
import { NgTransService } from '../services/ng-trans.service';
import { isEqual } from 'lodash-es';

@Pipe({
  name: 'ngTrans',
  pure: false
})
export class NgTransPipe implements PipeTransform, OnDestroy {

  private latestValue: string = '';

  private destroy$ = new Subject<void>();

  private key: string = '';

  private options: INgTransOptions | undefined;

  constructor(
    private changeDR: ChangeDetectorRef,
    private transService: NgTransService,
  ) {
    this.subscribeLangChange();
  }

  transform(key: string, options?: INgTransOptions): string {
    if (!this.latestValue || key !== this.key || !isEqual(options, this.options)) {
      this.latestValue = this.transService.translationSync(key, options);

      this.key = key;
      this.options = options;
    }

    return this.latestValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeLangChange(): void {
    this.transService.subscribeLangChange().pipe(
      switchMap(_ => this.transService.translationAsync(this.key, this.options)),
      takeUntil(this.destroy$)
    ).subscribe(latestValue => this.updateLatestValue(latestValue));
  }

  private updateLatestValue(latestValue: string): void {
    this.latestValue = latestValue;
    this.changeDR.markForCheck();
  }

}
