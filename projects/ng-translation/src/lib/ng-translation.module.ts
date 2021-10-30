import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgTranslationSubcontentComponent } from './components';
import { NgTranslationComponent } from './ng-translation.component';
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
