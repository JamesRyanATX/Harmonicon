import {
  InstrumentModel,
  EffectModel,
  SessionModel,
  TrackModel,
  PhraseModel,
  PatchModel,
  NoteModel,
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

  /**
   * Set meter (time signature).
   * 
   * @param {*} meter 
   * @param {*} proxy 
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
   * @param {*} swing 
   * @param {*} proxy 
   */
  swing(swing, proxy) {
    this.sequence({
      type: 'swing',
      at: proxy.data.at,
      value: swing,
    })
  }

  /**
   * Set tempo.
   * 
   * @param {*} tempo 
   * @param {*} proxy 
   */
  tempo(tempo, proxy) {
    this.sequence({
      type: 'tempo',
      at: proxy.data.at,
      value: tempo,
    });
  }

  /**
   * Set key.  Accepts any valid ABC note.
   * 
   * @param {*} key 
   * @param {*} proxy 
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
   * Set scale/mode.  Accepts any valid mode.
   * 
   * @param {*} scale 
   * @param {*} proxy 
   */
  scale(scale, proxy) {
    this.sequence({
      type: 'scale',
      at: proxy.data.at,
      value: scale,
    })
  }

  /**
   * Create an instrument.
   * 
   * @param {*} name 
   * @param {*} fn 
   */
  instrument(name, fn) {
    this.model.instruments.add(InstrumentModel.parse({
      name, fn, session: this.model
    }));
  }

  /**
   * Create an effect.
   * 
   * @param {*} name 
   * @param {*} fn 
   */
  effect(name, fn) {
    this.model.effects.add(EffectModel.parse({
      name, fn, session
    }));
  }

  /**
   * Create a track.
   * 
   * @param {*} name 
   * @param {*} fn 
   * @returns 
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
   * Create a patch (send the output of one audio node to another)
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

  /**
   * Create a phrase.
   * 
   * @param {String} name 
   * @param {Function|Array} steps 
   * @returns 
   */
  async phrase(name, steps) {
    const phrase = PhraseModel.parse({
      session: this.model,
      name: name,
    });

    this.model.phrases.add(phrase);

    if (typeof steps === 'function') {
      return await PhraseComposer.compose(name, steps, {
        session: this,
        model: phrase,
      });  
    }
    else {
      phrase.properties.steps = steps;
    }
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
