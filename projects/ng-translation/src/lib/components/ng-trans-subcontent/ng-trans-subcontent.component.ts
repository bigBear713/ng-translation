import { isString } from 'lodash-es';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { INgTransSentencePart } from '../../models/ng-trans-sentence-part.interface';

@Component({
  selector: '[ng-trans-subcontent]',
  template: `
    <ng-container [ngSwitch]="isString">
    <ng-container *ngSwitchCase="true">{{content}}</ng-container>
    <ng-container *ngSwitchCase="false" [ngTemplateOutlet]="$any(content)" [ngTemplateOutletContext]="{list}">
      </ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTransSubcontentComponent implements OnChanges, OnInit {

  @Input()
  content: string | TemplateRef<any> = '';

  @Input()
  list: INgTransSentencePart[] = [];

  isString: boolean = true;

  constructor(
    private changeDR: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.content) {
      this.updateIsString(this.content);
    }
  }

  ngOnInit() { }

  private updateIsString(content: string | TemplateRef<any> = ''): void {
    this.isString = isString(content);
    this.changeDR.markForCheck();
  }

}