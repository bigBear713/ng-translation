import { Observable } from "rxjs";

export interface INgTransLoader {
  [langKey: string]: Object | (() => (Observable<Object> | Promise<Object>));
}
