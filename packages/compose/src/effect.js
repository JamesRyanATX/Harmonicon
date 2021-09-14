import { BaseSequencedComposer } from './base/sequenced';
import { EffectModel } from '@composer/core';

/**
 * Create effects with {@link SessionComposer#effect|session.effect()}:
 * 
 * ``` javascript
 * session.effect('fx-reverb', ({ effect }) => {
 *   return new Tone.Reverb({
 *     wet: 0.5
 *   });
 * });
 * ```
 * 
 * @sort 6
 * @label Effects
 * @category Composers
 * @extends BaseSequencedComposer
 * @hideconstructor
 */
export class EffectComposer extends BaseSequencedComposer {
  static modelContextName = 'effect';
  static model = EffectModel;
}

export const instrument = InstrumentComposer.composer();