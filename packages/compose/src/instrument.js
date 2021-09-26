import { BaseSequencedComposer } from './base/sequenced';
import { InstrumentModel } from '@composer/core';

/**
 * Create new instruments with {@link SessionComposer#instrument|session.instrument()}:
 * 
 * ``` javascript
 * session.instrument('synth', () => {
 *   return new Tone.MonoSynth();
 * });
 * ```
 * 
 * Import built-in instruments with {@link SessionComposer#use|session.use()}:
 * 
 * ``` javascript
 * session.use('core.instrument.piano');
 * ```
 * 
 * In order to {@link NoteComposer|play notes}, an instrument must be associated 
 * with a track and {@link SessionComposer#send|sent} to the main output.  The latter
 * is important, or else you won't hear any audio.
 * 
 * ``` javascript
 * // Create a track called "synth-pad"
 * session.track('synth-pad', ({ track }) => {
 *   track.at(0).play(whole.note('Cmaj7'));
 * });
 * 
 * // Route the "synth" instrument to the "synth-pad" track:
 * session.send.instrument('synth').to.track('synth-pad');
 * 
 * // Send the "synth-pad" track to the main output:
 * session.send.track('synth-pad').to.main();
 * ```
 * 
 * ## Built-in Instruments
 * 
 * ### Tone.js
 * 
 * Any [Tone.js](https://tonejs.github.io/) instrument can be used out of the box:
 * 
 * ``` javascript
 * session.instrument('my-synth', () => {
 *   return new Tone.MetalSynth();
 * });
 * ```
 * 
 * ### Core Library
 * 
 * The core library contains a basic set of sample-based instruments.  Refer to the Library
 * panel in the Harmonicon UI for the full list.
 * 
 *
 * ## Writing Custom Instruments
 * 
 * At its core, an instrument is simply an [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) instance.
 * 
 * ``` javascript
 * session.instrument('custom-instrument', () => {
 *   // ...example needed
 *   return myAudioNode;
 * })
 * ```
 * 
 * @hideconstructor
 * @sort 2
 * @label Instruments
 * @category Composers
 */
 export class InstrumentComposer extends BaseSequencedComposer {
  static composerContextName = 'instrument';
  static model = InstrumentModel;

  /**
   * Assign instrument to a library group.
   * 
   * @param {string} group 
   */
  group(group) {
    this.model.setProperties({ group });
  }

  /**
   * Give the instrument a description.
   * 
   * @param {string} description 
   */
  description(description) {
    this.model.setProperties({ description });
  }

  /**
   * Denote the author of the instrument, if applicable.
   * 
   * @param {string} author 
   */
  author(author) {
    this.model.setProperties({ author });
  }

  /**
   * Set website of the instrument, if applicable.
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
   * Default options passed to builder function at runtime; overridden by `#options`.
   * 
   * @param {object} defaultOptions 
   */
  defaultOptions(defaultOptions) {
    this.model.setProperties({ defaultOptions });
  }

  /**
   * Octave most relevant to the instrument's pitch and timbre.
   * 
   * @param {integer} suggestedOctave 
   */
  suggestedOctave(suggestedOctave) {
    this.model.setProperties({ suggestedOctave });
  }

  /**
   * Set runtime builder function that returns an Web Audio Node.
   * 
   * @param {object} defaultOptions 
   */
  fn(fn) {
    this.model.setProperties({ fn });
  }

  /**
   * Map of pitch aliases, for example "snare" may refer to "c4".
   * 
   * @param {object} pitchAliases 
   */
  pitchAliases(pitchAliases) {
    this.model.setProperties({ pitchAliases });
  }

}

export const instrument = InstrumentComposer.composer();