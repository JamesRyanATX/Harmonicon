import { BaseModel } from './base.js';

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
        measure: Number(a),
        beat: Number(b),
        subdivision: Number(c)
      })
    }

    // .parse({ measure: 0, ... })
    else if (typeof a === 'object') {
      return new this(a);
    }

    // .parse('0:0:0')
    else if (typeof a === 'string') {
      const [ measure, beat, subdivision ] = a.split(':');

      return new this({ 
        measure: Number(measure),
        beat: Number(beat),
        subdivision: Number(subdivision)
      });
    }
    
    else {
      throw new TypeError(`PositionModel.parse: unrecognized position format`);
    }
  }

  add (units) {
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