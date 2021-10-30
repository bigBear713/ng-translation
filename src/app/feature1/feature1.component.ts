import { isString } from 'lodash-es';
import { NgTranslationService } from 'ng-translation';
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
    return this.translationService.translationSync('title');
  }

  get titleWithParams() {
    return this.translationService.translationSync('content.contentWithParams', this.params);
  }

  trans = trans;

  constructor(
    private translationService: NgTranslationService,
  ) {
  }

  ngOnInit(): void {
    this.title$ = this.translationService.translationAsync('title');
    this.titleWithParams$ = this.translationService.translationAsync('content.contentWithParams', this.params);
  }

  isString(content: any): boolean {
    return isString(content);
  }

}
