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
    pitchAliases: {
      type: Object,
      defaultValue: () => ({})
    },
  }

  get patchType () {
    return 'instrument';
  }

  async render () {
    return await this.fn(this.options);
  }

}

InstrumentModel.init();