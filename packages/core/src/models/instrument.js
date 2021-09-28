import { BaseNodeModel } from './base/node.js';

export class InstrumentModel extends BaseNodeModel {

  static properties = {
    session: {
      json: false,
    },
    name: {
      type: String
    },
    fn: {
      type: Function
    },
    group: {
      type: String
    },
    description: {
      type: String
    },
    author: {
      type: String
    },
    url: {
      type: String
    },
    documentationUrl: {
      type: String
    },
    options: {
      type: Object,
      defaultValue: () => ({})
    },
    defaultOptions: {
      type: Object,
      defaultValue: () => ({})
    },
    suggestedOctave: {
      type: Number,
      defaultValue: 4
    },
    pitchAliases: {
      type: Object,
      defaultValue: () => ({})
    },
  }

  get patchType () {
    return 'instrument';
  }

  // Render an audio node and ensure it's ready for use
  async render () {
    const node = await this.fn(this.options);

    if (node.loaded !== false) {
      return node;
    }

    // Audio node may need time to load samples and external objects
    return new Promise((accept, reject) => {
      const interval = setInterval(() => {
        if (node.loaded) {
          clearInterval(interval);
          accept(node);
        }
      }, 500);
    });
  }

}

InstrumentModel.init();