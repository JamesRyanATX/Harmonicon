import { BaseModel } from './base.js';

export class RouteModel extends BaseModel {

  static properties = {
    source: {
      type: String
    },
    destination: {
      type: String
    }
  }

}

RouteModel.init();