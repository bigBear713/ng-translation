export interface INgTranslationLoader {
  [langKey: string]: () => Promise<Object>;
}
