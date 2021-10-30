import {
    Pipe,
    PipeTransform
} from '@angular/core';

import { INgTranslationParams } from '../models';
import { NgTranslationService } from '../ng-translation.service';

@Pipe({
  name: 'ngTranslationContent'
})
export class NgTranslationContentPipe implements PipeTransform {

  constructor(
    private translationService: NgTranslationService,
  ) { }

  transform(value: any, params?: INgTranslationParams): any {
    params = params || {};
    return this.translationService.handleSentenceWithParams(value, params);
  }

}
