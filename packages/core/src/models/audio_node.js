import { BaseModel } from './base.js';

export class AudioNodeModel extends BaseModel {

  static properties = {

    // Name of audio node
    name: {
      type: String,
    },

    // Whether or not this audio node represents the root (no children)
    root: {
      type: Boolean
    },

    // Model associated with the audio node
    model: {
      type: Object
    },

    // Underlying node provided by driver
    node: {
      type: Object
    },

  }

  get loaded() {
    return false;
  }

  connect(to) {
    this.logger.error('#connect not implemented in audio driver');
  }

  toString() {
    return `${this.name}${this.root ? ' (root)' : ''}`;
  }
};

AudioNodeModel.init();