import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  NgTranslationComponent,
  NgTranslationSubcontentComponent
} from './components';
import {
  NgTranslationContentPipe,
  NgTranslationPipe
} from './pipes';

const COMPONENTS = [
  NgTranslationComponent,
  NgTranslationSubcontentComponent,
];

const PIPES = [
  NgTranslationPipe,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
    NgTranslationContentPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...COMPONENTS,
    ...PIPES,
  ]
})
export class NgTranslationModule { }
