import { BaseNodeModel } from './base/node';
import { SequencedEventModel } from './sequenced_event';
import { sequenceable } from './mixins/sequenceable';


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

  // // Return a (sequenceable) source for this track, like an instrument
  // get source () {
  //   console.log(JSON.stringify(this.inputs));
  //   return null;
  //   // const patch = this.inputs.filter((patch) => {
  //   //   return patch.inputType === 'instrument';
  //   // })[0]);

  //   // if (patch) {
  //   //   return this.session.instruments.filter((i) => (i.name === patch.input))[0];
  //   // }
  //   // else {
  //   //   return null;
  //   // }
  // }

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