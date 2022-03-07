import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbCommonModule } from '@bigbear713/nb-common';

import {
  NgTransComponent,
  NgTransSubcontentComponent
} from './components';
import {
  NgTransContentPipe,
  NgTransPipe,
  SentenceItemTypePipe,
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
    SentenceItemTypePipe,
  ],
  imports: [
    CommonModule,
    NbCommonModule,
  ],
  exports: [
    ...COMPONENTS,
    ...PIPES,
  ]
})
export class NgTransModule { }
