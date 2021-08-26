import { BaseNodeModel } from './base/node';

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
    }
  }

}

EffectModel.init();