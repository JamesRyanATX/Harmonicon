import { BaseModel } from './base';

export class SequencedEventModel extends BaseModel {
  static properties = {
    at: {},
    type: {},
    value: {}
  }
}

SequencedEventModel.init();