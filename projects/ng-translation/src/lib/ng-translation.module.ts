import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgTranslationComponent } from './ng-translation.component';

const COMPONENTS = [
  NgTranslationComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class NgTranslationModule { }
