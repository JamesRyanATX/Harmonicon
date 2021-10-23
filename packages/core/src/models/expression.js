import { BaseModel } from './base.js';
import { NoteModel } from './note.js';

import { ascendExpression } from './expressions/ascend';
import { bounceExpression } from './expressions/bounce';
import { curveExpression } from './expressions/curve';
import { cycleExpression } from './expressions/cycle';
import { descendExpression } from './expressions/descend';
import { eachExpression } from './expressions/each';
import { multiplyExpression } from './expressions/multiply';
import { randomizeExpression } from './expressions/randomize';
import { transposeExpression } from './expressions/transpose';

function oneOf(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export class ExpressionModel extends BaseModel {

  static properties = {
    source: {
      type: Array,
      defaultValue: () => ([]),
    },
    options: {
      type: Object,
      defaultValue: () => ({}),
    },
    transform: {
      defaultValue: () => ((source) => (source))
    },
  }

  static transforms = {
    ascend: ascendExpression,
    bounce: bounceExpression,
    curve: curveExpression,
    cycle: cycleExpression,
    descend: descendExpression,
    each: eachExpression,
    multiply: multiplyExpression,
    randomize: randomizeExpression,
    transpose: transposeExpression,
  }

  toExpression(properties = {}) {
    return new ExpressionModel({ source: this, ...properties });
  }

  // Expression helpers
  // ------------------


  ascend(to, options = {}) {
    return this.toExpression({
      transform: 'curve',
      options: { ...options, property: 'pitch', to }
    });
  }


  bounce(property, values = [], options = {}) {
    return this.toExpression({
      transform: 'bounce',
      options: { ...options, property, values }
    });
  }


  curve(property, options = {}) {
    return this.toExpression({
      transform: 'curve',
      options: { ...options, property }
    });
  }


  cycle(property, values = [], options = {}) {
    return this.toExpression({
      transform: 'cycle',
      options: { ...options, property, values }
    });
  }

  descend(to, options = {}) {
    return this.toExpression({
      transform: 'curve',
      options: { ...options, property: 'pitch', to }
    });
  }

  each(fn, options = {}) {
    return this.toExpression({
      transform: 'each',
      options: { ...options, fn }
    });
  }

  multiply(n, options = {}) {
    return this.toExpression({
      transform: 'multiply',
      options: { ...options, n }
    });
  }

  randomize(property, values = [], options = {}) {
    return this.toExpression({
      transform: 'randomize',
      options: { ...options, property, values }
    });
  }

  transpose(interval, options = {}) {
    return this.toExpression({
      transform: 'transpose',
      options: { ...options, interval }
    });
  }



  /**
   * Prepare the source property for transformation.
   * 
   * @returns {Array}
   */
  compiledSource() {
    if (this.source instanceof ExpressionModel) {
      return this.source.compile();
    }
    else if (this.source instanceof NoteModel) {
      return [ this.source ];
    }
    else {
      return this.source;
    }
  }

  compile() {
    if (!this.constructor.transforms[this.transform]) {
      throw new TypeError(`Unknown expression transform "${this.transform}".`);
    }

    const transform = this.constructor.transforms[this.transform];
    const options = { ...transform.options, ...this.options };
    const source = this.compiledSource();

    return transform.fn.call(this, { source, options });
  }

}

ExpressionModel.init();