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
  static composerContextName = 'effect';
  static model = EffectModel;

  group(group) {
    this.model.setProperties({ group });
  }

  description(description) {
    this.model.setProperties({ description });
  }

  author(author) {
    this.model.setProperties({ author });
  }

  url(url) {
    this.model.setProperties({ url });
  }

  documentationUrl(documentationUrl) {
    this.model.setProperties({ documentationUrl });
  }

  options(options) {
    this.model.setProperties({ options });
  }

  defaultOptions(defaultOptions) {
    this.model.setProperties({ defaultOptions });
  }

  fn(fn) {
    this.model.setProperties({ fn });
  }

}

export const instrument = EffectComposer.composer();