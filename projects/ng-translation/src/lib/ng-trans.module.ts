import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  NgTransComponent,
  NgTransSubcontentComponent
} from './components';
import {
  NgTransContentPipe,
  NgTransPipe,
  SentenceItemTypePipe,
  TplContentPipe,
} from './pipes';

const COMPONENTS = [
  NgTransComponent,
  NgTransSubcontentComponent,
];

const PIPES = [
  NgTransPipe,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    NgTransContentPipe,
    TplContentPipe,
    SentenceItemTypePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...COMPONENTS,
    ...PIPES,
  ]
})
export class NgTransModule { }
