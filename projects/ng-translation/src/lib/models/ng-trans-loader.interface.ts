export interface INgTransLoader {
  [langKey: string]: Object | (() => Promise<Object>);
}
