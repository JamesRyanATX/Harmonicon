import { TrackModel, PhraseModel, ExpressionModel } from '@composer/core';
import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { ComposerError } from './errors';
import { BaseSequencedComposer } from './base/sequenced';
import { generateIdentifier } from '@composer/util';

/**
 * Create new tracks with {@link SessionComposer#track|session.track()}:
 * 
 * ##### Examples
 *
 * Play a single note:
 * 
 * ```
 * session.track('drums', ({ track } => {
 *   track.at(0).play(quarter.note('kick'));
 * });
 * ```
 * 
 * Play a simple beat:
 * 
 * ```
 * session.track('drums', ({ track } => {
 *   track.at(0).play.phrase([
 *     quarter.note('kick'),
 *     quarter.note('snare'),
 *     quarter.note('kick'),
 *     quarter.note('snare'),
 *   ]);
 * });
 * ```
 * 
 * @sort 3
 * @label Tracks
 * @extends BaseSequencedComposer
 * @category Composers
 * @hideconstructor
 */
export class TrackComposer extends BaseSequencedComposer {
  static composerContextName = 'track';
  static model = TrackModel;

  /**
   * Sequence one or more {@link NoteComposer|notes}.
   * 
   * ##### Examples
   *
   * Play a single {@link NoteComposer|note}:
   * 
   * ```
   * session.track('drums', ({ track } => {
   *   track.at(0).play(quarter.note('kick'));
   * });
   * ```
   * 
   * Play multiple {@link NoteComposer|notes} at once:
   * 
   * ```
   * session.track('drums', ({ track } => {
   *   track.at(0).play(quarter.note('kick snare ride'));
   * });
   * ```
   * 
   * Play a {@link PhraseComposer|phrase} by name:
   * 
   * ```
   * session.track('drums', ({ track } => {
   *   track.at(0).play.phrase('beat');
   * });
   * ```
   * 
   * Define and play a {@link PhraseComposer|phrase}:
   *
   * ```
   * session.track('drums', ({ track } => {
   *   track.at(0).play.phrase([
   *     quarter.note('kick'),
   *     quarter.note('snare'),
   *     quarter.note('kick'),
   *     quarter.note('snare'),
   *   ]);
   * });
   * ```
   * 
   * @sort 101
   * @proxiedBy at
   * @param {*} note 
   * @param {*} proxy 
   */
  play(note, proxy) {
    this.sequence({
      type: 'note',
      at: proxy.data.at,
      value: note,
    })
  }

  // By name:
  //   phrase(name)
  //
  // By sequence or expression (anonymous)
  //   phrase([ ... ])
  phrase(nameOrSequence, proxy) {
    const anonymous = typeof nameOrSequence !== 'string';
    const phrase = (() => {
      if (anonymous) {
        return this.model.session.phrases.add(PhraseModel.parse({
          name: `${this.model.name}-${generateIdentifier()}`,
          sequence: ExpressionModel.coerce(nameOrSequence)
        }));
      }
      else {
        return this.model.session.phrases.filterByProperty('name', nameOrSequence)[0];
      }
    })();

    if (!phrase) {
      throw new ComposerError(`Phrase "${nameOrSequence}" is not defined.`)
    }

    this.sequence({
      type: 'phrase',
      at: proxy.data.at,
      value: phrase.name,
    });
  }

  /**
   * Set key/root note for this track only.
   * 
   * @ignore
   * @todo not implemented
   * @proxiedBy at
   * @param {*} key 
   * @param {*} proxy 
   */
  key(key, proxy) {
    this.sequence({
      type: 'key',
      at: proxy.data.at,
      value: key,
    });
  }

  /**
   * Set scale for this track only.
   * 
   * @ignore
   * @todo not implemented
   * @proxiedBy at
   * @param {*} scale 
   * @param {*} proxy 
   */
  scale(scale, proxy) {
    this.sequence({
      type: 'scale',
      at: proxy.data.at,
      value: scale,
    });
  }

  /**
   * Set track volume in dB.
   * 
   * ``` javascript
   * session.track('drums', ({ track }) => {
   *   track.at(0).volume(-10);
   * });
   * 
   * @sort 102
   * @proxiedBy at
   * @param {number} volume - volume in decibels 
   * @param {*} proxy 
   */
  volume(volume, proxy) {
    this.sequence({
      type: 'volume',
      at: proxy.data.at,
      value: volume,
    });
  }

  /**
   * Set track panning (-1 to 1).
   * 
   * ``` javascript
   * session.track('drums', ({ track }) => {
   *   track.at(0).pan(-0.75);
   * });
   * 
   * @sort 103
   * @proxiedBy at
   * @param {number} pan - pan from -1 (L) to 1 (R)
   * @param {*} proxy 
   */
  pan(pan, proxy) {
    this.sequence({
      type: 'pan',
      at: proxy.data.at,
      value: pan,
    });
  }

  /**
   * Mute the track.
   * 
   * ##### Examples
   * 
   * Mute track at measure 5:
   * 
   * ``` javascript
   * session.track('drums', ({ track }) => {
   *   track.at(5).mute();
   * });
   * ```
   * 
   * Mute entire track:
   * 
   * ``` javascript
   * session.track('drums', ({ track }) => {
   *   track.mute();
   * });
   * ```
   * 
   *  Mute for first 10 measures only:
   * 
   * ``` javascript
   * session.track('drums', ({ track }) => {
   *   track.at(0).mute();
   *   track.at(9).mute(false);
   * });
   * ```
   * 
   * @sort 104
   * @proxiedBy at
   * @param {boolean} mute - mute value (default true)
   * @param {*} proxy 
   */
  mute() {
    const args = [ ...arguments ];
    const proxy = args.pop();
    const mute = args.length === 1 ? args[0] : true;

    this.sequence({
      type: 'mute',
      at: proxy.data.at,
      value: mute,
    });
  }

  /**
   * Solo the track (mute everything else).
   * 
   * @ignore
   * @sort 105
   * @todo not implemented
   * @proxiedBy at
   * @param {*} solo 
   * @param {*} proxy 
   */
  solo() {
    const args = [ ...arguments ];
    const proxy = args.pop();
    const solo = args.length === 1 ? args[0] : true;

    this.sequence({
      type: 'solo',
      at: proxy.data.at,
      value: solo,
    });
  }

}

export const TrackComposerProxy = SequencedEventProxy.create(TrackComposer, {
  methods: [ 
    'play',
    'phrase',
    'key',
    'scale',
    'volume',
    'pan',
    'mute',
    'solo',
  ],
  aliases: [
    {
      target: 'phrase',
      attachTo: 'play',
      name: 'phrase',
    }
  ]
});

export const track = TrackComposer.composer();