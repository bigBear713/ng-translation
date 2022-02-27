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

  get lang() {
    return this.transService.lang;
  }

  get title() {
    return this.transService.translationSync('title');
  }

  compStr1 = `
    <div>
      <ng-trans key="complexContent" [components]="[com0,com1,com2]" [options]="{params,prefix:'content'}"> </ng-trans>
    </div>

    <ng-template #com0 let-comContent="content" let-list="list">
      <b [ng-trans-subcontent]="comContent" [trans-subcontent-list]="list"></b>
    </ng-template>

    <ng-template #com1 let-comContent="content" let-list="list">
      <app-widget [comContent]="comContent" [list]="list"></app-widget>
    </ng-template>

    <ng-template #com2 let-comContent="content">
      <b>{{comContent}}</b>
    </ng-template>
  `;

  constructor(
    private transService: NgTransService,
  ) { }

  ngOnInit(): void {
    this.title$ = this.transService.translationAsync('title');
    this.titleWithParams$ = this.transService.translationAsync('content.contentWithParams', { params: this.params });
  }

  isString(content: any): boolean {
    return isString(content);
  }

}
