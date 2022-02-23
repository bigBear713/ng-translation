import { Subject } from 'rxjs';
import {
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import {
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransOptions } from '../models';
import { NgTransService } from '../services/ng-trans.service';

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
    private transService: NgTransService,
  ) {
    this.subscribeLangChange();
  }

  transform(key: string, options?: INgTransOptions): string {
    this.key = key;
    this.options = options;

    if (!this.latestValue) {
      this.latestValue = this.transService.translationSync(key, options);
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
    ).subscribe(latestValue => this.latestValue = latestValue);
  }

}
