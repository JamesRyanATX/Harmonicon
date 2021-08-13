import { BaseModel } from './base';

export class InstrumentModel extends BaseModel {

  static properties = {
    name: {
      type: String
    },
    fn: {
      type: Function
    }
  }

}

InstrumentModel.init();