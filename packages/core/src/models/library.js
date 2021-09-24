import { BaseModel } from './base.js';
import { InstrumentModel } from './instrument.js';
import { TrackModel } from './track.js';
import { EffectModel } from './effect.js';
import { PhraseModel } from './phrase.js';
import { ScriptModel } from './script.js';
import { sequenceable } from './mixins/sequenceable.js';

export class LibraryModel extends sequenceable(BaseModel) {

  static properties = {

    id: {
      type: String,
    },

    name: {
      type: String,
      defaultValue: 'Untitled'
    },

    instruments: {
      type: InstrumentModel,
      collection: true,
    },

    effects: {
      type: EffectModel,
      collection: true,
    },

    phrases: {
      type: PhraseModel,
      collection: true,
    },

    tracks: {
      type: TrackModel,
      collection: true,
    },

    snippets: {
      type: ScriptModel,
      collection: true,
    },

    templates: {
      type: ScriptModel,
      collection: true,
    },

    demos: {
      type: ScriptModel,
      collection: true,
    },

  }

  effectsByGroup() {
    return this.effects.bucketizeByProperty('group', {
      emptyBucket: 'Other'
    });
  }

  instrumentsByGroup() {
    return this.instruments.bucketizeByProperty('group', {
      emptyBucket: 'Other'
    });
  }

}

LibraryModel.init();