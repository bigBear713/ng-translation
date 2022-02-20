import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransParams } from '../models/ng-trans-params.interface';
import { NgTransService } from '../services/ng-trans.service';

@Pipe({
  name: 'ngTransContent'
})
export class NgTransContentPipe implements PipeTransform {

  constructor(
    private transService: NgTransService,
  ) { }

  transform(trans: string, params?: INgTransParams): string {
    return this.transService.handleSentenceWithParams(trans, params);
  }

}
