import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTranslationParams } from '../models/ng-translation-params.interface';
import { NgTranslationService } from '../services/ng-translation.service';

@Pipe({
  name: 'ngTranslationContent'
})
export class NgTranslationContentPipe implements PipeTransform {

  constructor(
    private translationService: NgTranslationService,
  ) { }

  transform(trans: string, params?: INgTranslationParams): string {
    return this.translationService.handleSentenceWithParams(trans, params);
  }

}
