import { PhraseModel } from '@composer/core';
import { BaseComposer } from './base';


export class PhraseComposer extends BaseComposer {
  static composerContextName = 'phrase';
  static model = PhraseModel;

  steps() {
    this.model.properties.steps = [ ...arguments ];
  }
}

export const phrase = PhraseComposer.composer();