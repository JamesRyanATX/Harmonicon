import { BaseModel } from './base.js';

export class SequencedEventModel extends BaseModel {
  static properties = {
    at: {},
    type: {},
    value: {}
  }
}

SequencedEventModel.init();