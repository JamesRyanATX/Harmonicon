import { BaseModel } from './base.js';

export class ScriptModel extends BaseModel {

  static properties = {
    source: {
      type: String
    },
    name: {
      type: String
    },
    script: {
      type: String
    },
  }

}

ScriptModel.init();