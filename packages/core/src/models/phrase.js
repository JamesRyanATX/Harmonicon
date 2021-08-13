import { BaseModel } from './base';

export class PhraseModel extends BaseModel {

  static properties = {
    steps: {},
    session: {},
    name: {},
  }

}

PhraseModel.init();