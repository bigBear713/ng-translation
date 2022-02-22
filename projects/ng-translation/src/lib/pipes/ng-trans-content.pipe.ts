import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransParams } from '../models/ng-trans-params.interface';
import { NgTransCoreService } from '../services/ng-trans-core.service';

@Pipe({
  name: 'ngTransContent'
})
export class NgTransContentPipe implements PipeTransform {

  constructor(
    private transCoreService: NgTransCoreService,
  ) { }

  transform(trans: string, params?: INgTransParams): string {
    return this.transCoreService.handleSentenceWithParams(trans, params);
  }

}
