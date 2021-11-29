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
import { noopExpression } from './expressions/noop';


const transforms = {
  ascend: ascendExpression,
  bounce: bounceExpression,
  curve: curveExpression,
  cycle: cycleExpression,
  descend: descendExpression,
  each: eachExpression,
  multiply: multiplyExpression,
  randomize: randomizeExpression,
  transpose: transposeExpression,
  noop: noopExpression,
}

export class ExpressionModel extends BaseModel {

  static properties = {

    // The object that should be transformed
    source: {
      type: [ Array, NoteModel, ExpressionModel ],
      defaultValue: () => ([]),
    },

    // Whether or not the expression represents a sequence of notes or a single moment in time
    sequence: {
      type: Boolean,
      defaultValue: true,
    },

    // Options object passes to transform function
    options: {
      type: Object,
      defaultValue: () => ({}),
    },

    // Name of transformation to apply
    transform: {
      type: String,
      oneOf: Object.keys(transforms),
      defaultValue: 'noop'
    },
  }

  static transforms = transforms;

  static coerce(source) {
    if (source instanceof this) {
      return source;
    }
    else {
      return this.parse({ source });
    }
  }

  toExpression(properties = {}) {
    return new ExpressionModel({ source: this, ...properties });
  }

  get length() {
    return this.source.length;
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

    const compiled = (function compile(source) {

      // source = <ExpressionModel>
      if (source instanceof ExpressionModel) {
        return source.compile();
      }

      // source = <NoteModel>
      else if (source instanceof NoteModel) {
        return source;
      }

      // source = [ <ExpressionModel>, <NoteModel>, ... ]
      else if (Array.isArray(source)) {
        return source.reduce((compiled, sourcePart) => {
          const part = compile(sourcePart);

          return compiled.concat(sourcePart.sequence
            ? compile(sourcePart)
            : [ compile(sourcePart) ]
          );
        }, []);
      }

      // source = ?
      else {
        return source;
      }
    })(this.source);

    return Array.isArray(compiled) ? compiled : [ compiled ];
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