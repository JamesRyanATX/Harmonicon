import { ModelValidationError } from "@composer/util";
import { Note as TonalNote } from "@tonaljs/tonal";
import { BaseModel } from './base.js';
import { ExpressionModel } from './expression';
import { config } from '../config';

export class NoteModel extends BaseModel {

  static properties = {

    pitch: {
      type: [ String, Number ],
      defaultValue: null,
      validate: (value) => {

        // Is a valid integer (relative pitch)
        if (Number.isInteger(value)) {
          return true;
        }

        // Is a valid half step integer (4.5)
        if (typeof value === 'number' && Number.isInteger(value * 2)) {
          return true;
        }

        // Is a valid ABC note
        if (value.match && value.match(/^[abcdefg][\#b]{0,3}[0-9]{0,1}\.{0,1}5{0,1}$/i)) {
          return true;
        }

        // Is a valid pitch alias
        if (config.pitchAliases[value]) {
          return true;
        }

        throw new ModelValidationError(`pitch must be in ABC notation, an integer or an alias; got ${value}`);
      }
    },

    pitchType: {
      type: String,
      defaultValue: 'absolute',
    },

    duration: {
      json: (v) => (v.toDecimal())
    },

    velocity: {
      type: Number,
      defaultValue: 1,
      withinRange: [ 0, 1 ]
    },

    octave: {
      type: Number,
      defaultValue: null
    }
  }

  get definition () {
    return this._definition = this._definition || Note.get(this.pitch);
  }

  get relative () {
    return this.pitchType === 'relative';
  }

  static simplifyAbsolutePitch(pitch) {
    return TonalNote.simplify(pitch);
  }

  static parseAbsolutePitch({ pitch, octave }) {
    const inlineOctave = TonalNote.octave(pitch);

    // Note aliases
    if (!pitch.match(/^[abcdefg][b#]{0,1}[0-9]{0,1}$/i)) {
      return {
        pitch, octave
      }
    }

    // Octave autoshift
    else if ([ 'a', 'a#', 'bb', 'b', 'cb' ].indexOf(pitch.toLowerCase()) > -1) {
      return (typeof octave === 'number') ?
        {
          pitch: TonalNote.name(`${pitch}${octave}`),
          octave: octave,
        } : {
          pitch: TonalNote.name(`${pitch}3`),
          octave: 3
        }
    }

    else if (inlineOctave === undefined) {
      return (typeof octave === 'number') ?
        {
          pitch: TonalNote.name(`${pitch}${octave}`),
          octave: octave,
        } : {
          pitch: TonalNote.name(`${pitch}4`),
          octave: 4
        }
    }
    else {
      return {
        pitch: TonalNote.name(pitch),
        octave: inlineOctave
      }
    }
  }

  static propertiesForRelativePitch(pitch) {
    return {
      pitch: Number(pitch),
      pitchType: 'relative',
      octave: null,
    }
  }
  
  static propertiesForAbsolutePitch({ pitch, octave }) {
    return Object.assign(this.parseAbsolutePitch({ pitch, octave }), {
      pitchType: 'absolute'
    });
  }

  static propertiesForPitch({ pitch, octave }) {
    if (this.pitchType(pitch) === 'relative') {
      return this.propertiesForRelativePitch(pitch);
    }
    else {
      return this.propertiesForAbsolutePitch({ pitch, octave });
    }
  }

  static pitchType(pitch) {
    if (!!String(pitch).match(/^-{0,1}[0-9]+\.{0,1}[0-9]*/)) {
      return 'relative';
    }
    else {
      return 'absolute';
    }
  }

  static parse(properties) {
    return new this(Object.assign(
      {},
      properties,
      this.propertiesForPitch(properties),
    ));
  }

  sanitize() {
    this.pitchType = this.constructor.pitchType(this.pitch);
    return this;
  }

  toExpression(properties = {}) {
    return ExpressionModel.parse({ ...properties,
      source: [ this ]
    })
  }

  transpose(interval) {
    return this.clone().setProperties({
      pitch: TonalNote.transpose(this.pitch, interval)
    }).sanitize();
  }

  multiply(n) {
    return this.toExpression({
      transform: 'multiply',
      options: { n },
    });
  }

  computedPitch(keySignature) {
    if (this.relative) {
      return keySignature.computeRelativeNote(this).pitch;
    }
    else {
      return this.pitch;
    }
  }

  toString() {
    return `${this.pitch} (${this.duration.name})`;
  }

}

NoteModel.init();