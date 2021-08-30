import { BaseModel } from './base.js';

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