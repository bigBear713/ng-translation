import {
  Pipe,
  PipeTransform
} from '@angular/core';

import { INgTransParams } from '../models';
import { NgTransToolsService } from '../services';

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
