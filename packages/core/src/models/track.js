import { BaseNodeModel } from './base/node.js';
import { SequencedEventModel } from './sequenced_event.js';
import { sequenceable } from './mixins/sequenceable.js';


export class TrackModel extends sequenceable(BaseNodeModel) {

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

  get patchType () {
    return 'track';
  }

  getSequenceableInputs() {
    return this.inputs.reduce((sequenceables, input) => {
      if (input.sequenceable) {
        sequenceables.push(input);
      }
      else {
        return sequenceables.concat(input.sequenceableAncestors);
      }

      return sequenceables;
    }, []);
  }

  keySignatureAt(position) {
    return this.session.keySignatureAt(position);
  }

  meterAt(position) {
    return this.session.meterAt(position);
  }

}

TrackModel.init();