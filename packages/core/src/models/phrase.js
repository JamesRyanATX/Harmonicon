import { BaseModel } from './base.js';

export class PhraseModel extends BaseModel {

  static properties = {
    steps: {},
    session: {},
    name: {},
  }

}

PhraseModel.init();