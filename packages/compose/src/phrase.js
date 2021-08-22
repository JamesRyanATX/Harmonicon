import { PhraseModel } from '@composer/core';
import { BaseComposer } from './base';


export class PhraseComposer extends BaseComposer {
  static composerContextName = 'phrase';
  static model = PhraseModel;

  steps(steps) {
    this.model.properties.steps = Array.isArray(steps) ? steps : [ ...arguments ];
  }
}

export const phrase = PhraseComposer.composer();