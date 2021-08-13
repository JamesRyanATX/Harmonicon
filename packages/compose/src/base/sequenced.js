import { PositionModel, SequencedEventModel } from '@composer/core';
import { BaseComposer } from '../base';

export class BaseSequencedComposer extends BaseComposer {
  static sequencerProxy = null;

  constructor(name, fn, context) {
    super(name, fn, context);

    this.at.measure = (measure) => {
      return this.at(measure, 0, 0);
    }
  }

  at() {
    return new this.constructor.sequencerProxy(this, {
      at: PositionModel.parse.apply(PositionModel, arguments)
    });
  }

  sequence(event) {
    this.model.events.add(SequencedEventModel.parse(event));
  }
}
