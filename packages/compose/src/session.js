import {
  SessionModel,
  TrackModel,
  PhraseModel,
  PatchModel,
} from '@composer/core';

import * as CoreLibrary from '@composer/library-core';
import { Logger } from '@composer/util';

import { SequencedEventProxy } from './util/sequenced_event_proxy';
import { BaseSequencedComposer } from './base/sequenced';
import { TrackComposer } from './track';
import { PhraseComposer } from './phrase';
import { SessionComposerProxies } from './session/proxies';
import { ComposerError } from './errors';

import { extendable } from './mixins/extendable';

export class SessionComposer extends extendable(BaseSequencedComposer) {
  static composerContextName = 'session';
  static model = SessionModel;
  static proxies = SessionComposerProxies;
  static logger = new Logger('SessionComposer');

  // Install library-core by default
  static defaultLibraries = [
    CoreLibrary
  ];

  static async initialize() {
    await this.initializeLibraries();
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

  effect(name, fn) {
    this.model.effects.add({
      name, fn
    });
  }

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
   * Send the output of one audio node to another.
   * 
   * @param  {object} properties
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
    return (this.renderer = await this.model.render(driver));
  }

  play (options) {
    return this.renderer.play(options);
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
