import { BaseComposer } from '../base';
import { ScriptModel } from '@composer/core';

export class BaseScriptComposer extends BaseComposer {
  static model = ScriptModel;

  constructor(name, fn, context) {
    super(name, fn, context);
  }

  source(source = '') {
    this.model.setProperties({ source });
  }

  description(description = '') {
    this.model.setProperties({ description });
  }
}
