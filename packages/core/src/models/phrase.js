import { BaseModel } from './base.js';
import { ExpressionModel } from './expression';

export class PhraseModel extends BaseModel {

  static properties = {
    sequence: {
      type: ExpressionModel
    },

    compiled: {
      type: Array
    },

    session: {
      type: Object,
    },

    name: {
      type: String
    },
  }

  compile() {
    this.compiled = this.sequence.compile();
    return this;
  }

}

PhraseModel.init();