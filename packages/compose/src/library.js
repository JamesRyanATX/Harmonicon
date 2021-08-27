import {
  LibraryModel,
} from '@composer/core';

import { BaseComposer } from './base';
import { ComposerError } from './errors';

export class LibraryComposer extends BaseComposer {
  static composerContextName = 'library';
  static model = LibraryModel;

  instrument(name, fn) {
    this.model.instruments.add({
      name, fn
    });
  }

  effect(name, fn) {
    this.model.effects.add({
      name, fn
    });
  }

  track(name, fn) {
    throw new ComposerError('not implemented');
  }

  phrase(name, fn) {
    throw new ComposerError('not implemented');
  }

}

export const library = LibraryComposer.composer();
