import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  NgTransComponent,
  NgTransSubcontentComponent
} from './components';
import {
  NgTransContentPipe,
  NgTransPipe
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
