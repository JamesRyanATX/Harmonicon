import { TrackModel, PhraseModel } from '@composer/core';
import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { BaseSequencedComposer } from './base/sequenced';
import { generateIdentifier } from '@composer/util';

export class TrackComposer extends BaseSequencedComposer {
  static composerContextName = 'track';
  static model = TrackModel;

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

  key(key, proxy) {
    this.sequence({
      type: 'key',
      at: proxy.data.at,
      value: key,
    });
  }

  scale(scale, proxy) {
    this.sequence({
      type: 'scale',
      at: proxy.data.at,
      value: scale,
    });
  }

  volume(volume, proxy) {
    this.sequence({
      type: 'volume',
      at: proxy.data.at,
      value: volume,
    });
  }

  pan(pan, proxy) {
    this.sequence({
      type: 'pan',
      at: proxy.data.at,
      value: pan,
    });
  }

  mute(mute, proxy) {
    this.sequence({
      type: 'mute',
      at: proxy.data.at,
      value: mute,
    });
  }

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