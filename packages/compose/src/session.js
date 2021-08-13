import {
  SessionModel,
  TrackModel,
  PhraseModel
} from '@composer/core';

import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { BaseSequencedComposer } from './base/sequenced';
import { TrackComposer } from './track';
import { PhraseComposer } from './phrase';


export class SessionComposer extends BaseSequencedComposer {
  static composerContextName = 'session';
  static model = SessionModel;

  get send() {
    return {
      instrument: (instrumentName) => {
        return {
          to: {
            track: (trackName) => {
              this.logger.error(`sending output of instrument "${instrumentName}" to track "${trackName}"`);
            }
          }
        }
      }
    }
  }

  meter(meter, proxy) {
    this.sequence({
      type: 'meter',
      at: proxy.data.at,
      value: meter,
    });
  }

  swing(swing, proxy) {
    this.sequence({
      type: 'swing',
      at: proxy.data.at,
      value: swing,
    })
  }

  tempo(tempo, proxy) {
    this.sequence({
      type: 'tempo',
      at: proxy.data.at,
      value: tempo,
    });
  }

  key(key, proxy) {
    this.sequence({
      type: 'key',
      at: proxy.data.at,
      value: key,
    })
  }

  scale(scale, proxy) {
    this.sequence({
      type: 'scale',
      at: proxy.data.at,
      value: scale,
    })
  }

  instrument(name, fn) {
    this.model.instruments.add({
      name, fn
    });
  }

  async track(name, fn) {
    const track = TrackModel.parse({
      session: this.model,
      name: name
    });

    this.model.tracks.add(track);

    return await TrackComposer.compose(name, fn, {
      session: this,
      model: track,
    });
  }

  async phrase(name, fn) {
    const phrase = PhraseModel.parse({
      session: this.model,
      name: name
    });

    this.model.phrases.add(phrase);

    return await PhraseComposer.compose(name, fn, {
      session: this,
      model: phrase,
    });
  }

  async render (driver) {
    return this.model.render(driver);
  }
}

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