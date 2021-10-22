import { times } from '@composer/util';
import { BaseModel } from './base.js';
import { NoteModel } from './note.js';

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

    transpose: {
      options: {
        interval: '0M',
      },
      fn: ({ source, options: { interval } }) => {
        return source.map((note) => {
          return note.transpose(interval);
        });
      }
    },

    each: {
      options: {
        fn: (note) => (note),
      },
      fn: ({ source, options: { fn } }) => {
        return source.map((note) => {
          return fn(note.clone()).sanitize();
        });
      }
    },

    randomize: {
      options: {
        property: null,
        values: [],
      },
      fn: ({ source, options: { property, values } }) => {
        return source.map((note) => {
          return note.clone({ [property]: oneOf(values) }).sanitize();
        });
      }
    },

    bounce: {
      options: {
        property: null,
        values: [],
      },
      fn: ({ source, options: { property, values} }) => {
        let descending = false;
        let position = 0;
  
        return source.map((original, i) => {
          const note = original.clone({
            [property]: values[position]
          }).sanitize();

          // End of range; begin descending
          if (position === values.length - 1) {
            position -= 1;
            descending = true;
          }

          // Beginning of range
          else if (position === 0) {
            position = 1;
            descending = false;
          }

          // Mid-range
          else {
            position += (descending) ? -1 : 1;
          }

          return note;
        });
      }
    },

    cycle: {
      options: {
        property: null,
        values: [],
        reverse: false,
      },
      fn: ({ source, options: { values, property, reverse } }) => {
        return source.map((note, i) => {
          return note.clone({
            [property]: reverse
              ? values[(values.length - 1) - (i % values.length)]
              : values[i % values.length]
          }).sanitize();
        });
      }
    },

    multiply: {
      options: {
        n: 5,
      },
      fn: ({ source, options: { n } }) => {
        const iterations = times(n, (i) => (i));

        return iterations.reduce((notes) => {
          return notes.concat(source.map((s) => (s.clone())));
        }, []);
      }
    },
  }

  toExpression(properties = {}) {
    return new ExpressionModel({ source, ...properties });
  }

  each(fn) {
    return this.toExpression({
      transform: 'each',
      options: { fn }
    });
  }

  transpose(interval) {
    return this.toExpression({
      transform: 'transpose',
      options: { interval }
    });
  }

  multiply(n) {
    return this.toExpression({
      transform: 'multiply',
      options: { n }
    });
  }

  randomize(property, values = []) {
    return this.toExpression({
      transform: 'randomize',
      options: { property, values }
    });
  }

  bounce(property, values = [], reverse = false) {
    return this.toExpression({
      transform: 'bounce',
      options: { property, values }
    });
  }

  cycle(property, values = [], reverse = false) {
    return this.toExpression({
      transform: 'cycle',
      options: { property, values, reverse }
    });
  }

  cycleReverse(property, values) {
    return this.cycle(property, values, true);
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