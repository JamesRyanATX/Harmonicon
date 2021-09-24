import {
  InstrumentModel,
  EffectModel,
  SessionModel,
  TrackModel,
  PhraseModel,
  PatchModel,
  NoteModel,
  Harmonicon,
} from '@composer/core';

import { Logger, mapSeries } from '@composer/util';

import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { BaseSequencedComposer } from './base/sequenced';
import { TrackComposer } from './track';
import { PhraseComposer } from './phrase';
import { SessionComposerProxies } from './session/proxies';
import { ComposerError } from './errors';

/**
 * Sessions are the top-level object that house compositions.
 * 
 * Do not invoke the constructor directly; instead, use the `session()` factory.
 *
 * ##### Example
 * 
 * ``` javascript
 * session('my-masterpiece', async ({ library }) => {
 *   session.instrument('synth', async () => {
 *     return new Tone.MonoSynth();
 *   });
 * 
 *   session.track('synth', async ({ track }) => {
 *      track.at(0).play(quarter.note('C4'));
 *   });
 * 
 *   session.send.instrument('synth').to.track('synth');
 *   session.send.track('synth').to.main();
 * });
 * ```
 * 
 * 
 * @sort 1
 * @label Sessions
 * @category Composers
 * @hideconstructor
 * @extends BaseSequencedComposer
 */
export class SessionComposer extends BaseSequencedComposer {
  static composerContextName = 'session';
  static model = SessionModel;
  static proxies = SessionComposerProxies;
  static logger = new Logger('SessionComposer');

  /**
   * Import an object from an external library.
   * 
   * - **Effects** - via `session.use.effect()`
   * - **Instruments** -- via `session.use.instrument()`
   * - **Phrases** -- via `session.use.phrase()`
   * - **Tracks** -- via `session.use.track()`
   * 
   * ##### Examples
   *
   * Load an instrument from the core library:
   * 
   * ``` javascript
   * session.use.instrument('bass').from.library('core');
   * ```
   * 
   * Same as above, but library name autodetection:
   * 
   * ``` javascript
   * session.use.instrument('bass').from.library();
   * ```
   * 
   * Same as above, but using the low-level API:
   * 
   * ``` javascript
   * session.use({
   *   name: 'electric-bass',
   *   collection: 'instruments',
   *   source: 'library',
   *   libraryName: 'core',
   *   composer: 'instrument'
   * });
   * ```
   * 
   * @sort 0
   * @param {Object} params
   * @param {string} [params.source=library] - Source type (only "library" allowed for now)
   * @param {string} [params.collection=instruments] - Collection type
   * @param {string} [params.composer=instrument] - Composer type (effect, instrument, phrase, or track)
   * @param {string} [params.libraryName=core] - name of library
   * @param {string} [params.name] - name of object
   */
  use({
    source = 'library',
    collection = 'instruments',
    composer = 'instrument',
    libraryName = null,
    name = null,
    options = {},
  }) {
    if (source === 'library') {

      // If libraryName not provided, try and infer it
      if (!libraryName) {
        libraryName = Object.entries(Harmonicon.libraries).reduce((memo, [ libName, lib ]) => {
          return (lib[collection].getByName(name)) ? libName : memo;
        }, libraryName);
      }

      if (!libraryName) {
        throw new ComposerError(`${composer}.${name} not found.`);
      }

      const library = Harmonicon.libraries[libraryName];
      const item = library[collection].filterByProperty('name', name)[0];

      if (!item) {
        throw new ComposerError(`${libraryName}.${composer}.${name} not found.`);
      }

      this[composer](name, item.fn, options);
    }
    else {
      throw new ComposerError(`Unsupported import source "${source}"`);
    }
  }


  /**
   * Callback for `session.instrument()` composer function.
   *
   * @callback sessionComposerInstrumentCallback
   * @param {object} params
   * @param {InstrumentComposer} params.instrument
   * @param {object} params.options
   * @returns {AudioNode}
   */

  /**
   * Create an {@link InstrumentComposer|instrument}. 
   * 
   * @sort 10
   * @param {string} name - name of new instrument
   * @param {sessionComposerInstrumentCallback} fn - builder function that returns an AudioNode 
   * @param {object} options - options to pass to builder function at render time
   * @returns {InstrumentComposer}
   */
  instrument(name, fn, options = {}) {
    this.model.instruments.add(InstrumentModel.parse({
      name, fn, options, session: this.model
    }));
  }

  
  /**
   * Callback for `session.track()` composer function.
   *
   * @callback sessionComposerTrackCallback
   * @param {object} params
   * @param {TrackComposer} params.track
   */

  /**
   * Create a {@link TrackComposer|track}.
   * 
   * @sort 20
   * @param {string} name - name of new track
   * @param {sessionComposerTrackCallback} fn - builder function
   * @returns {TrackComposer}
   */
   track(name, fn) {
    const track = TrackModel.parse({
      session: this.model,
      name: name,
    });

    this.model.tracks.add(track);

    return TrackComposer.compose(name, fn, {
      session: this,
      model: track,
    });
  }


  /**
   * Callback for `session.phrase()` composer function.
   *
   * @callback sessionComposerPhraseCallback
   * @param {object} params
   * @param {PhraseComposer} params.phrase
   */

  /**
   * Create a {@link PhraseComposer|phrase}.
   * 
   * @sort 30
   * @param {String} name - name of new phrase
   * @param {sessionComposerPhraseCallback|Array} steps - sequenced notes as array or a builder function
   * @returns {PhraseComposer}
   */
  phrase(name, steps) {
    const phrase = PhraseModel.parse({
      session: this.model,
      name: name,
    });

    this.model.phrases.add(phrase);

    if (typeof steps === 'function') {
      return PhraseComposer.compose(name, steps, {
        session: this,
        model: phrase,
      });  
    }
    else {
      phrase.properties.steps = steps;
    }
  }


  /**
   * Callback for `session.effect()` composer function.
   *
   * @callback sessionComposerEffectCallback
   * @param {object} params
   * @param {EffectComposer} params.effect
   * @param {object} params.options
   * @returns {AudioNode}
   */

  /**
   * Create an {@link EffectComposer|effect}.
   * 
   * @sort 40
   * @param {string} name - name of new effect
   * @param {sessionComposerEffectCallback} fn - builder function that returns an AudioNode 
   * @param {object} options - options to pass to builder function at render time
   * @returns {EffectComposer}
   */
  effect(name, fn, options = {}) {
    this.model.effects.add(EffectModel.parse({
      name, fn, options, session
    }));
  }


  /**
   * Route the output of one node to the input of another.
   * 
   * Each session requires at least 2 types of sends in order to produce audio-- instruments to tracks, and tracks to main.
   * 
   * ##### Examples
   * 
   * Send an **instrument** to a **track**:
   * ``` javascript
   * session.send.instrument('electric-guitar').to.track('lead-guitar');
   * ```
   * 
   * Send a **track** to **main**:
   * ``` javascript
   * session.send.track('lead-guitars').to.main();
   * ```
   * 
   * Send two instruments to the same track to play the same notes:
   * ``` javascript
   * session.send.instrument('electric-guitar').to.track('lead-guitars');
   * session.send.instrument('acoustic-guitar').to.track('lead-guitars');
   * ```
   * 
   * Add reverb to a track:
   * ``` javascript
   * session.effect('lead-guitars-reverb', ...);
   * 
   * session.send.track('lead-guitars').to.effect('lead-guitars-reverb');
   * session.send.effect('lead-guitars-reverb').to.main();
   * ```
   * 
   * Chain multiple effects to a single track:
   * ``` javascript
   * session.effect('lead-guitars-reverb', ...);
   * session.effect('lead-guitars-phaser', ...);
   * session.effect('lead-guitars-delay', ...);
   * 
   * session.send.track('lead-guitars').to.effect('lead-guitars-reverb');
   * session.send.effect('lead-guitars-reverb').to.effect('lead-guitars-phaser');
   * session.send.effect('lead-guitars-phaser').to.effect('lead-guitars-delay');
   * session.send.effect('lead-guitars-delay').to.main();
   * ```
   * 
   * Create a master effect chain by adding an intermediary track before main:
   *
   * ``` javascript
   * session('master-effect-chain', async ({session}) => {
   * 
   *   // ...instruments
   *   // ...tracks
   * 
   *   // Main effects
   *   session.effect('main-reverb', async () { // ... });
   *   session.effect('main-phaser', async () { // ... });
   *   session.effect('main-delay', async () { // ... });
   * 
   *   // This track contains no notes; it's for routing only
   *   session.track('main-fx', async () => {});
   * 
   *   session.send.track('lead-guitar').to.track('main-fx');
   *   session.send.track('bass').to.track('main-fx');
   *   session.send.track('drums').to.track('main-fx');
   *   session.send.track('xylophone').to.track('main-fx');
   *  
   *   session.send.effect('main-fx').to.effect('main-phaser');
   *   session.send.effect('main-phaser').to.effect('main-delay');
   *   session.send.effect('main-delay').to.main();
   * 
   * });
   * ```
   * 
   * Alternatively, patches can be created using `send()` directly:
   * ``` javascript
   * session.send({
   *   inputType: 'track',
   *   input: 'drums',
   *   outputType: 'effect',
   *   output: 'drums-reverb'
   * })
   * ```
   * 
   * @sort 40
   * @param {object} properties
   * @param {string} properties.inputType - type of input (instrument, track, or effect)
   * @param {string} properties.input - name of input device
   * @param {string} properties.outputType - type of output (instrument, track, or effect)
   * @param {string} properties.output - name of output device
   * @returns {PatchModel}
   */
   send(properties = {}) {
    const patch = PatchModel.parse(Object.assign({
      session: this.model,
    }, properties));

    const { valid, errors } = patch.validate();

    if (!valid) {
      throw new ComposerError(errors[0].message);
    }

    this.model.patches.add(patch);

    return patch;
  }


  /**
   * Set meter (time signature).
   * 
   * ##### Examples
   * 
   * Set meter to 4/4:
   * ``` javascript
   * session.at(0).meter([4, 4])
   * ```
   * 
   * Change to 6/8 at measure 25:
   * ``` javascript
   * session.at(25).meter([6, 8])
   * ```

   * 
   * @sort 101
   * @proxiedBy at
   * @param {Array} meter - time signature as fraction ([4, 4], [6, 8], etc.)
   * @returns {SessionComposer}
   */
  meter(meter, proxy) {
    this.sequence({
      type: 'meter',
      at: proxy.data.at,
      value: meter,
    });
  }

  /**
   * Set swing amount.
   * 
   * ##### Examples
   * 
   * Traditional swing:
   * ``` javascript
   * session.at(0).swing(0.5);
   * ```
   * 
   * Mellower swing for vibin':
   * ``` javascript
   * session.at(0).swing(0.25);
   * ```
   * 
   * @sort 102
   * @proxiedBy at
   * @param {decimal} swing - swing amount between zero and 1
   * @returns {SessionComposer}
   */
  swing(swing, proxy) {
    this.sequence({
      type: 'swing',
      at: proxy.data.at,
      value: swing,
    })
  }

  /**
   * Set tempo in beats per minute.
   * 
   * ``` javascript
   * session.at(0).tempo(160);
   * ```
   * 
   * @sort 103
   * @proxiedBy at
   * @param {integer} tempo - beats per minute
   * @returns {SessionComposer}
   */
  tempo(tempo, proxy) {
    this.sequence({
      type: 'tempo',
      at: proxy.data.at,
      value: tempo,
    });
  }

  /**
   * Set root note of key signature.  Accepts any valid ABC note.
   * 
   * ##### Examples:
   * 
   * Play song in key of D:
   * ``` javascript
   * session.at(0).key('D');
   * ```
   * 
   * Play song in key of D, but in octave 2 instead of 4 (default):
   * ``` javascript
   * session.at(0).key('D2');
   * ```
   * 
   * Change key signatures throughout composition:
   * ``` javascript
   * session.at(0).key('D').scale('major');
   * session.at(20).key('Eb').scale('minor');
   * session.at(30).key('G').scale('minor');
   * ```
   * 
   * @sort 104
   * @proxiedBy at
   * @param {string} key - root note of key signature (A..G)
   * @returns {SessionComposer}
   */
  key(key, proxy) {
    const formattedKey = NoteModel.simplifyAbsolutePitch(key[0]);

    if (!formattedKey) {
      throw new ComposerError(`Invalid key "${key[0]}"; must be a single note (A..G)`);
    }

    this.sequence({
      type: 'key',
      at: proxy.data.at,
      value: [ formattedKey ],
    })
  }

  /**
   * Set the scale part of the key signature.  Accepts any valid mode:
   * 
   * * Major (Ionian)
   * * Dorian
   * * Phrygian
   * * Lydian
   * * Mixolydian
   * * Minor (Aeolian)
   * * Locrean
   * 
   * ##### Examples
   * 
   * Play song in D minor:
   * ``` javascript
   * session.at(0).key('D').scale('minor');
   * ```
   * 
   * Play song in A major, but in octave 2 instead of 4 (default):
   * ``` javascript
   * session.at(0).key('A2').scale('major');
   * ```
   * 
   * Change key signatures throughout composition:
   * ``` javascript
   * session.at(0).key('D').scale('major');
   * session.at(20).key('Eb').scale('minor');
   * session.at(30).key('G').scale('minor');
   * ```
   * @sort 105
   * @proxiedBy at
   * @param {string} scale - name of scale/mode (see supported values above)
   * @returns {SessionComposer}
   */
  scale(scale, proxy) {
    this.sequence({
      type: 'scale',
      at: proxy.data.at,
      value: scale,
    })
  }


  /**
   * Called when parsing begins, before builder function is executed.
   * 
   * @private
   * @ignore
   * @emits Harmonicon#composer:parsing
   */
  begin () {
    Harmonicon.emit('composer:parsing', this);
  }

  /**
   * Called when parsing is complete.
   * 
   * @private
   * @ignore
   * @emits Harmonicon#composer:parsed
   */
  finish () {
    Harmonicon.emit('composer:parsed', this);
  }

  /**
   * Session will be parsed.
   * 
   * @event Harmonicon#composer:parsing
   * @type {object}
   * @property {SessionComposer} session - session that will be parsed
   */

  /**
   * Session has been parsed.
   * 
   * @event Harmonicon#composer:parsed
   * @type {object}
   * @property {SessionComposer} session - session that was parsed
   */

  /**
   * Session is being rendered.
   * 
   * @event Harmonicon#composer:rendering
   * @type {object}
   * @property {SessionComposer} session - session that will be rendered
   */

  /**
   * Session has been rendered.
   * 
   * @event Harmonicon#composer:rendered
   * @type {object}
   * @property {SessionComposer} session - session that was rendered
   */

  /**
   * Render session with an audio driver.
   * 
   * ```
   * const session = await session('my-song', async ({ session }) => {
   *  // ...
   * })
   * 
   * const driver = new ToneAudioDriver();
   * const renderer = await session.render(driver);
   * 
   * renderer.play();
   * ```
   * 
   * @private
   * @ignore
   * @emits Harmonicon#composer:rendering
   * @emits Harmonicon#composer:rendered
   * @param {AudioDriver} driver 
   * @returns {RendererModel}
   */
  async render (driver) {
    Harmonicon.emit('composer:rendering', this);
    this.renderer = await this.model.render(driver);
    Harmonicon.emit('composer:rendered', this);

    return this.renderer;
  }

  play (options) {
    return this.renderer.play(options);
  }
}

/**
 * @ignore
 */
export const SessionComposerProxy = SequencedEventProxy.create(SessionComposer, {
  methods: [ 
    'meter',
    'tempo',
    'key',
    'swing',
    'scale'
  ]
});

export const session = SessionComposer.composer();
