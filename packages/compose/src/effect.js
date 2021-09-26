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

  /**
   * Assign effect to a library group.
   * 
   * @param {string} group 
   */
   group(group) {
    this.model.setProperties({ group });
  }

  /**
   * Give the effect a description.
   * 
   * @param {string} description 
   */
  description(description) {
    this.model.setProperties({ description });
  }

  /**
   * Denote the author of the effect, if applicable.
   * 
   * @param {string} author 
   */
  author(author) {
    this.model.setProperties({ author });
  }

  /**
   * Set website of the effect, if applicable.
   * 
   * @param {string} url 
   */
  url(url) {
    this.model.setProperties({ url });
  }

  /**
   * Set documentation URL.
   * 
   * @param {string} documentationUrl 
   */
  documentationUrl(documentationUrl) {
    this.model.setProperties({ documentationUrl });
  }

  /**
   * Options that should be passed to the builder function at runtime.
   * 
   * @param {object} options 
   */
  options(options) {
    this.model.setProperties({ options });
  }

  /**
   * Set runtime builder function that returns an Web Audio Node.
   * 
   * @param {object} defaultOptions 
   */
  fn(fn) {
    this.model.setProperties({ fn });
  }

}

export const instrument = EffectComposer.composer();