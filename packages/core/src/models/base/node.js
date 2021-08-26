import { BaseModel } from '../base';

export class BaseNodeModel extends BaseModel {

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

}