import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransParams } from '../models/ng-trans-params.interface';
import { NgTransToolsService } from '../services/ng-trans-tools.service';

@Pipe({
  name: 'ngTransContent'
})
export class NgTransContentPipe implements PipeTransform {

  constructor(
    private transToolsService: NgTransToolsService,
  ) { }

  transform(trans: string, params?: INgTransParams): string {
    return this.transToolsService.handleSentenceWithParams(trans, params);
  }

}
