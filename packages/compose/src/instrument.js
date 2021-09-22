import { BaseSequencedComposer } from './base/sequenced';
import { InstrumentModel } from '@composer/core';

/**
 * Create new instruments with {@link SessionComposer#instrument|session.instrument()}:
 * 
 * ``` javascript
 * session.instrument('synth', async () => {
 *   return new Tone.MonoSynth();
 * });
 * ```
 * 
 * Import built-in instruments with {@link SessionComposer#use|session.use()}:
 * 
 * ``` javascript
 * session.use.instrument('piano').from.library();
 * ```
 * 
 * In order to {@link NoteComposer|play notes}, an instrument must be associated 
 * with a track and {@link SessionComposer#send|sent} to the main output.  The latter
 * is important, or else you won't hear any audio.
 * 
 * ``` javascript
 * // Create a track called "synth-pad"
 * session.track('synth-pad', async ({ track }) => {
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
 * session.instrument('my-synth', async () => {
 *   return new Tone.MetalSynth();
 * });
 * ```
 * 
 * ### Core Library
 * 
 * The core library contains a basic set of sample-based instruments:
 * 
 * Category   | Instrument  | Name              | Source
 * -----------|-------------|-------------------|-------
 * Bass       | Electric    | `electric-bass`   | [freesound.org](https://www.freesound.org)
 * Brass      | French Horn | `french-horn`     | [freesound.org](https://www.freesound.org)
 * Brass      | Trombone    | `trombone`        | [freesound.org](https://www.freesound.org)
 * Brass      | Trumpet     | `trumpet`         | [freesound.org](https://www.freesound.org)
 * Brass      | Tuba        | `tuba`            | [freesound.org](https://www.freesound.org)
 * Guitar     | Electric    | `electric-guitar` | [freesound.org](https://www.freesound.org)
 * Guitar     | Acoustic    | `acoustic-guitar` | [freesound.org](https://www.freesound.org)
 * Guitar     | Nylon       | `nylon-guitar`    | [freesound.org](https://www.freesound.org)
 * Keyboards  | Harmonium   | `harmonium`       | [freesound.org](https://www.freesound.org)
 * Keyboards  | Organ       | `organ`           | [freesound.org](https://www.freesound.org)
 * Keyboards  | Piano       | `piano`           | [freesound.org](https://www.freesound.org)
 * Percussion | Drums       | `drums`           | [freesound.org](https://www.freesound.org)
 * Percussion | Xylophone   | `xylophone`       | [freesound.org](https://www.freesound.org)
 * Strings    | Cello       | `cello`           | [freesound.org](https://www.freesound.org)
 * Strings    | Contrabass  | `contrabass`      | [freesound.org](https://www.freesound.org)
 * Strings    | Harp        | `harp`            | [freesound.org](https://www.freesound.org)
 * Strings    | Violin      | `violin`          | [freesound.org](https://www.freesound.org)
 * Woodwinds  | Bassoon     | `bassoon`         | [freesound.org](https://www.freesound.org)
 * Woodwinds  | Clarinet    | `clarinet`        | [freesound.org](https://www.freesound.org)
 * Woodwinds  | Flute       | `flute`           | [freesound.org](https://www.freesound.org)
 * Woodwinds  | Saxophone   | `saxophone`       | [freesound.org](https://www.freesound.org)
 * 
 *
 * ## Writing Custom Instruments
 * 
 * At its core, an instrument is simply an [AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) instance.
 * 
 * ``` javascript
 * session.instrument('custom-instrument', async () => {
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

  pitchAliases(pitchAliases) {
    this.model.setProperties({ pitchAliases });
  }

}

export const instrument = InstrumentComposer.composer();