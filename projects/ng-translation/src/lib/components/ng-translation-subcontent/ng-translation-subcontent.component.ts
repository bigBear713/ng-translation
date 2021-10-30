import { isString } from 'lodash';

import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef
} from '@angular/core';

@Component({
  selector: '[ng-translation-subcontent]',
  templateUrl: './ng-translation-subcontent.component.html',
  styleUrls: ['./ng-translation-subcontent.component.scss']
})
export class NgTranslationSubcontentComponent implements OnChanges, OnInit {

  @Input()
  content: string | TemplateRef<any> = '';

  @Input()
  list: any[] = [];

  isString: boolean = true;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.content) {
      this.updateIsString(this.content);
    }
  }

  ngOnInit() {
  }

  updateIsString(content: string | TemplateRef<any> = ''): void {
    this.isString = isString(content);
  }

}
