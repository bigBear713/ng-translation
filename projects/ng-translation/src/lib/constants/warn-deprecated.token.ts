import { InjectionToken } from "@angular/core";

export const WARN_DEPRECATED = new InjectionToken<boolean>('ng-trans lib deprecated warning');
/**
 * @deprecated use "WARN_DEPRECATED" please
 */
export const WARN_DEPRECATED_TOKEN = WARN_DEPRECATED;