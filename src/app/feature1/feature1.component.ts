import { isString } from 'lodash-es';
import { NgTransService } from 'ng-trans';
import { Observable } from 'rxjs';

import {
  Component,
  OnInit
} from '@angular/core';

import { trans } from '../localization/en/translations';

@Component({
  selector: 'app-feature1',
  templateUrl: './feature1.component.html',
  styleUrls: ['./feature1.component.scss']
})
export class Feature1Component implements OnInit {

  title$: Observable<string> | undefined;
  titleWithParams$: Observable<string> | undefined;

  params = {
    params1: '{{params2}}',
    params2: '1111',
    params3: '2222',
  };

  get title() {
    return this.transService.translationSync('title');
  }

  get titleWithParams() {
    return this.transService.translationSync('content.contentWithParams', { params: this.params });
  }

  contentWithParams = 'This is a sentence. <0>component1</0>. <0>This is params: {{params1}} - {{params2}} - {{params3}} - {{params2}}</0>.<1><0>component2</0> abc</1>.<1>test <0>this is params: {{params1}} - {{params2}} - {{params3}} - {{params2}}</0></1>.<2>this is component3</2>222';

  constructor(
    private transService: NgTransService,
  ) {
  }

  ngOnInit(): void {
    this.title$ = this.transService.translationAsync('title');
    this.titleWithParams$ = this.transService.translationAsync('content.contentWithParams', { params: this.params });
  }

  isString(content: any): boolean {
    return isString(content);
  }

}
