import { PositionModel, SequencedEventModel, InvalidPositionError } from '@composer/core';
import { BaseComposer } from '../base';
import { ComposerError } from '../errors';

export class BaseSequencedComposer extends BaseComposer {
  static sequencerProxy = null;

  constructor(name, fn, context) {
    super(name, fn, context);
  }

  at() {
    try {
      return new this.constructor.sequencerProxy(this, {
        at: PositionModel.parse.apply(PositionModel, arguments)
      });  
    }
    catch (e) {
      if (e instanceof InvalidPositionError) {
        throw new ComposerError(e.message);
      }
      else {
        throw e;
      }
    }
  }

  sequence(event) {
    this.model.events.add(SequencedEventModel.parse(event));
  }
}
