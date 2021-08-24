import { BaseSequencedModel } from './base/sequenced';
import { SequencedEventModel } from './sequenced_event';

export class TrackModel extends BaseSequencedModel {

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

  keySignatureAt(position) {
    return this.session.keySignatureAt(position);
  }

  meterAt(position) {
    return this.session.meterAt(position);
  }

}

TrackModel.init();