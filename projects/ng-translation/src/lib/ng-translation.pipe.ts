import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
    OnDestroy,
    Pipe,
    PipeTransform
} from '@angular/core';

import { NgTranslationService } from './ng-translation.service';

@Pipe({
  name: 'ngTranslation',
  pure: false
})
export class NgTranslationPipe implements PipeTransform, OnDestroy {

  latestValue: string = '';

  private key: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private translationService: NgTranslationService,
  ) {
    this.subscribeLangChange();
  }

  transform(key: any, args?: any): any {
    this.key = key;
    if (!this.latestValue) {
      this.latestValue = this.translationService.translationSync(this.key);
    }
    return this.latestValue;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeLangChange(): void {
    this.translationService.lang$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(_ => {
      this.latestValue = this.translationService.translationSync(this.key);
    });
  }

}
