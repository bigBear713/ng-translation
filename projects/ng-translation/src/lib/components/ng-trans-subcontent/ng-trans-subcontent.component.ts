import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef
} from '@angular/core';
import { INgTransSentencePart } from '../../models/ng-trans-sentence-part.interface';

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

  constructor() { }

}
