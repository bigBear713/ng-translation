import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  Optional,
  TemplateRef
} from '@angular/core';
import { deprecatedTip, WARN_DEPRECATED_TOKEN } from '../../constants';
import { INgTransSentencePart } from '../../models';

@Component({
  selector: '[ng-trans-subcontent]',
  template: `
    <ng-container [ngSwitch]="content | nbIsString">
      <ng-container *ngSwitchCase="true">{{content}}</ng-container>
      <ng-container *ngSwitchDefault
                    [ngTemplateOutlet]="content | nbTplContent" 
                    [ngTemplateOutletContext]="{ list }"></ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTransSubcontentComponent {

  @Input('ng-trans-subcontent')
  content: string | TemplateRef<any> = '';

  @Input('trans-subcontent-list')
  list: INgTransSentencePart[] = [];

  constructor(
    @Inject(WARN_DEPRECATED_TOKEN) @Optional() warnDeprecated: boolean,
  ) {
    if (warnDeprecated !== false) {
      console.warn(deprecatedTip);
    }
  }

}
