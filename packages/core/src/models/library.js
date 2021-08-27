import { BaseModel } from './base';
import { InstrumentModel } from './instrument';
import { TrackModel } from './track';
import { EffectModel } from './effect';
import { PhraseModel } from './phrase';
import { sequenceable } from './mixins/sequenceable';

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