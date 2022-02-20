import { InjectionToken } from '@angular/core';

import { INgTransLoader } from '../models';

export const NG_TRANS_LOADER = new InjectionToken<{ [key: string]: INgTransLoader }>('ng-translation-loader');
