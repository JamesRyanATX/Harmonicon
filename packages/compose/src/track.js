import { TrackModel, PhraseModel } from '@composer/core';
import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { BaseSequencedComposer } from './base/sequenced';
import { generateIdentifier } from '@composer/util';

/**
 * Create new tracks with {@link SessionComposer#track|session.track()}:
 * 
 * ```
 * tbd
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
   * Play a single note.
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
  // By steps (anonymous)
  //   phrase([ ... ])
  phrase(nameOrSteps, proxy) {
    const anonymous = typeof nameOrSteps !== 'string';
    const phrase = (() => {
      if (anonymous) {
        return this.model.session.phrases.add(PhraseModel.parse({
          name: `${this.model.name}-${generateIdentifier()}`,
          steps: nameOrSteps
        }));
      }
      else {
        return this.model.session.phrases.filterByProperty('name', nameOrSteps)[0];
      }
    })();

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
   * Set track volume.
   * 
   * @ignore
   * @todo not implemented
   * @proxiedBy at
   * @param {*} volume 
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
   * @ignore
   * @todo not implemented
   * @proxiedBy at
   * @param {*} pan 
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
   * @ignore
   * @todo not implemented
   * @proxiedBy at
   * @param {*} mute 
   * @param {*} proxy 
   */
  mute(mute, proxy) {
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
   * @todo not implemented
   * @proxiedBy at
   * @param {*} solo 
   * @param {*} proxy 
   */
  solo(solo, proxy) {
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