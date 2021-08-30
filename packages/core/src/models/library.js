import { BaseModel } from './base.js';
import { InstrumentModel } from './instrument.js';
import { TrackModel } from './track.js';
import { EffectModel } from './effect.js';
import { PhraseModel } from './phrase.js';
import { sequenceable } from './mixins/sequenceable.js';

export class LibraryModel extends sequenceable(BaseModel) {

  static properties = {

    effects: {
      type: EffectModel,
      collection: true,
    },

    id: {
      type: String,
    },

    instruments: {
      type: InstrumentModel,
      collection: true,
    },

    name: {
      type: String,
      defaultValue: 'Untitled'
    },

    phrases: {
      type: PhraseModel,
      collection: true,
    },

    tracks: {
      type: TrackModel,
      collection: true,
    },

  }

}

LibraryModel.init();