import { InjectionToken } from '@angular/core';

import { INgTranslationLoader } from '../models';

export const NG_TRANS_LOADER = new InjectionToken<{ [key: string]: INgTranslationLoader }>('ng-translation-loader');
