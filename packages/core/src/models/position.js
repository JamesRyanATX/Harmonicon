import { BaseModel } from './base';

export class PositionModel extends BaseModel {

  static properties = {
    measure: {
      defaultValue: 0
    },
    beat: {
      defaultValue: 0
    },
    subdivision: {
      defaultValue: 0
    },
  }
  
  static parse(a, b, c) {

    // .parse(0, 0, 0)
    if (typeof a !== 'undefined' &&
        typeof b !== 'undefined' &&
        typeof c !== 'undefined'
    ) {
      return new this({
        measure: a,
        beat: b,
        subdivision: c
      })
    }

    // .parse({ measure: 0, ... })
    else if (typeof a === 'object') {
      return new this(a);
    }

    // .parse('0:0:0')
    else if (typeof a === 'string') {
      const [ measure, beat, subdivision ] = a.split(':');

      return new this({ measure, beat, subdivision });
    }
    
    else {
      throw new TypeError(`PositionModel.parse: unrecognized position format`);
    }
  }

  add (units) {
    console.log('here?')
    return this.clone();
  }

  toMBS () {
    return `${this.measure}:${this.beat}:${this.subdivision}`;
  }

  toString () {
    return this.toMBS();
  }

}

PositionModel.init();