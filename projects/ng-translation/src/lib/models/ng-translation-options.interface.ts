import { INgTranslationParams } from './ng-translation-params.interface';

export interface INgTranslationOptions {
  prefix?: string;
  params?: INgTranslationParams;
  // return the trans key when the trans content is empty,
  // default is true
  returnKeyWhenEmpty?: boolean;
}
