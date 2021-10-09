import { BaseModel } from './base.js';
import { InvalidPositionError } from '../errors';

export class PositionModel extends BaseModel {

  static MEASURE_REGEX = /^[0-9]+$/;
  static BEAT_REGEX = /^[0-9]+\.{0,1}[0-9]*$/;
  static SUBDIVISION_REGEX = /^[0-9]+\.{0,1}[0-9]*$/;
  static MEASURE_BEAT_SUBDIVISION_REGEX = /^[0-9]+:[0-9]+\.{0,1}[0-9]*:[0-9]+\.{0,1}[0-9]*$/;

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
  
  static parse(measure, beat, subdivision) {

    if (
      typeof measure === 'object' &&
      typeof measure.measure !== 'undefined' &&
      typeof measure.beat !== 'undefined' &&
      typeof measure.subdivision !== 'undefined'
    ) {
      subdivision = measure.subdivision;
      beat = measure.beat;
      measure = measure.measure;
    }

    if (typeof measure === 'string' && measure.match(this.MEASURE_REGEX)) {
      measure = Number(measure);
    }

    if (typeof beat === 'string' && beat.match(this.BEAT_REGEX)) {
      beat = Number(beat);
    }

    if (typeof subdivision === 'string' && subdivision.match(this.SUBDIVISION_REGEX)) {
      subdivision = Number(subdivision);
    }

    // .parse('0:0:0')
    if (
      typeof measure === 'string' && 
      typeof beat === 'undefined' &&
      typeof subdivision === 'undefined' &&
      measure.match(this.MEASURE_BEAT_SUBDIVISION_REGEX)
    ) {
      [ measure, beat, subdivision ] = measure.split(':').map(Number);
    }

    // 0:undefined => 0:0
    if (typeof measure === 'number' && typeof beat === 'undefined') {
      beat = 0;
    }

    // 0:0:undefined => 0:0:0
    if (typeof measure === 'number' && typeof subdivision === 'undefined') {
      subdivision = 0;
    }

    if (
      typeof measure === 'number' &&
      typeof beat === 'number' &&
      typeof subdivision === 'number'
    ) {
      return new this({ measure, beat, subdivision });
    }
    else {
      throw new InvalidPositionError(`PositionModel.parse: unrecognized position format ${measure}:${beat}:${subdivision}`);
    }
  }

  get zero() {
    return this.measure === 0 && this.beat === 0 && this.subdivision === 0;
  }

  add (amount, unit = 'measure') {
    if (unit === 'measure') {
      return new this.constructor({
        measure: this.measure + amount,
        beat: this.beat,
        subdivision: this.subdivision
      })
    }
    else {
      throw new TypeError('only measure addition is supported');
    }
  }

  subtract (amount, unit = 'measure') {
    if (unit === 'measure') {
      return new this.constructor({
        measure: (this.measure - amount) >= 0 ? this.measure - amount : 0,
        beat: this.beat,
        subdivision: this.subdivision
      })
    }
    else {
      throw new TypeError('only measure subtraction is supported');
    }
  }

  toMBS () {
    return `${this.measure}:${this.beat}:${this.subdivision}`;
  }

  toString () {
    return this.toMBS();
  }

}

PositionModel.init();