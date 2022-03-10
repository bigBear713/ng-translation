import { CommonModule } from '@angular/common';
import { Inject, NgModule, Optional } from '@angular/core';
import { NbCommonModule } from '@bigbear713/nb-common';

import {
  NgTransComponent,
  NgTransSubcontentComponent
} from './components';
import { deprecatedTip, WARN_DEPRECATED_TOKEN } from './constants';
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
export class NgTransModule {
  constructor(@Inject(WARN_DEPRECATED_TOKEN) @Optional() warnDeprecated: boolean) {
    if (warnDeprecated !== false) {
      console.warn(deprecatedTip);
    }
  }
}
