import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgTranslationComponent } from './ng-translation.component';
import { NgTranslationPipe } from './ng-translation.pipe';

const COMPONENTS = [
  NgTranslationComponent
];

const PIPES = [
  NgTranslationPipe,
];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES,
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
