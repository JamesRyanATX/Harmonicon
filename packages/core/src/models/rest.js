import { BaseModel } from './base';

export class RestModel extends BaseModel {

  static properties = {
    duration: {
    }
  }

  toString() {
    return `Rest (${this.duration.name})`;
  }

}

RestModel.init();