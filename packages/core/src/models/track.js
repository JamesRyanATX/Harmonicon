import { BaseModel } from './base';
import { SequencedEventModel } from './sequenced_event';

export class TrackModel extends BaseModel {

  static properties = {
    events: {
      type: SequencedEventModel,
      collection: true,
    },
    name: {
      type: String
    },
    session: {
    }
  }

}

TrackModel.init();