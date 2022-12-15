import { InjectionToken } from "@angular/core";

export const NG_TRANS_MAX_RETRY = new InjectionToken<number>('ng-translation-max-retry');
/**
 * @deprecated use "NG_TRANS_MAX_RETRY" please
 */
export const NG_TRANS_MAX_RETRY_TOKEN = NG_TRANS_MAX_RETRY;