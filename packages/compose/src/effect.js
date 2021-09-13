import { BaseComposer } from './base';
import { EffectModel } from '@composer/core';

/**
 * Create an effect.
 * 
 * @sort 5
 * @label Effect
 * @category Composers
 */
export class EffectComposer extends BaseComposer {
  static modelContextName = 'effect';
  static model = EffectModel;
}

export const instrument = InstrumentComposer.composer();