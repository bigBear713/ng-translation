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

import { INgTranslationParams } from './models';
import { NgTranslationService } from './ng-translation.service';

@Pipe({
  name: 'ngTranslation',
  pure: false
})
export class NgTranslationPipe implements PipeTransform, OnDestroy {

  latestValue: string = '';

  private destroy$ = new Subject<void>();

  private key: string = '';

  private params: INgTranslationParams | undefined;

  constructor(
    private translationService: NgTranslationService,
  ) {
    this.subscribeLangChange();
  }

  transform(key: any, params?: INgTranslationParams): any {
    this.key = key;
    this.params = params;

    if (!this.latestValue) {
      this.latestValue = this.translationService.translationSync(this.key, this.params);
    }

    return this.latestValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeLangChange(): void {
    this.translationService.subscribeLangChange().pipe(
      switchMap(_ => this.translationService.translationAsync(this.key, this.params)),
      takeUntil(this.destroy$)
    ).subscribe(latestValue => this.latestValue = latestValue);
  }

}
