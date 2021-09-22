import { BaseNodeModel } from './base/node.js';

export class EffectModel extends BaseNodeModel {

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
    defaultOptions: {
      type: Object,
      defaultValue: () => ({})
    },
    options: {
      type: Object,
      defaultValue: () => ({})
    },
  }

  render () {
    return this.fn(this.options);
  }

}

EffectModel.init();