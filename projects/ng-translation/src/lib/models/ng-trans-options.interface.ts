import { INgTransParams } from './ng-trans-params.interface';

export interface INgTransOptions {
  prefix?: string;
  params?: INgTransParams;
  // return the trans key when the trans content is empty,
  // default is true
  returnKeyWhenEmpty?: boolean;
}
