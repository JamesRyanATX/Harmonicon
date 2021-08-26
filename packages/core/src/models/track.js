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

  get patches() {
    return this._patches = (this._patches || this.session.patches.reduce((patches, patch) => {
      if (patch.outputType === 'track' && patch.output === this.name) {
        patches.inputs.push(patch);
      }
      else if (patch.inputType === 'track' && patch.input === this.name) {
        patches.outputs.push(patch);
      }

      return patches;
    }, {
      inputs: [],
      outputs: []
    }));
  }

  get inputs () {
    return this.patches.inputs;
  }

  get outputs () {
    return this.patches.outputs;
  }

  get instrument () {
    const patch = (this._instrument || this.inputs.filter((patch) => {
      return patch.inputType === 'instrument';
    })[0]);

    if (patch) {
      return this.session.instruments.filter((i) => (i.name === patch.input))[0];
    }
    else {
      return null;
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