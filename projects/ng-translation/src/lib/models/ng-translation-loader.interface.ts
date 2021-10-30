export interface INgTranslationLoader {
  [langKey: string]: Object | (() => Promise<Object>);
}
