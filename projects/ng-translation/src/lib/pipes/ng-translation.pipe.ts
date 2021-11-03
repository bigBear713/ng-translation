import { Subject } from 'rxjs';
import {
    switchMap,
    takeUntil
} from 'rxjs/operators';

import {
    OnDestroy,
    Pipe,
    PipeTransform
} from '@angular/core';

import { INgTranslationOptions } from '../models';
import { NgTranslationService } from '../ng-translation.service';

@Pipe({
  name: 'ngTranslation',
  pure: false
})
export class NgTranslationPipe implements PipeTransform, OnDestroy {

  latestValue: string = '';

  private destroy$ = new Subject<void>();

  private key: string = '';

  private options: INgTranslationOptions | undefined;

  constructor(
    private translationService: NgTranslationService,
  ) {
    this.subscribeLangChange();
  }

  transform(key: any, options?: INgTranslationOptions): any {
    this.key = key;
    this.options = options;

    if (!this.latestValue) {
      this.latestValue = this.translationService.translationSync(key, options);
    }

    return this.latestValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeLangChange(): void {
    this.translationService.subscribeLangChange().pipe(
      switchMap(_ => this.translationService.translationAsync(this.key, this.options)),
      takeUntil(this.destroy$)
    ).subscribe(latestValue => this.latestValue = latestValue);
  }

}
