import { RendererError } from '../errors.js';
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

  get loggerName () {
    return `InstrumentModel`;
  }

  // Render an audio node and ensure it's ready for use
  async render () {
    const node = await this.fn(this.options);
    const timeout = 1;
    const poll = 0.5;

    if (node.loaded !== false) {
      return node;
    }

    // Audio node may need time to load samples and external objects
    return new Promise((accept, reject) => {
      let tries = 0;

      const interval = setInterval(() => {
        if (node.loaded) {
          clearInterval(interval);
          accept(node);
        }
        else if (tries * poll > timeout) {
          clearInterval(interval);
          this.logger.error(`#render() timeout loading "${this.name}"`);
          reject(new RendererError(`Timeout loading instrument: ${this.name}`));
        }
        else {
          tries += 1;
        }
      }, 500);
    });
  }

}

InstrumentModel.init();