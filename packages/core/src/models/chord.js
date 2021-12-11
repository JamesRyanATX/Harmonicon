import { BaseModel } from './base.js';
import { NoteModel } from './note.js';
import { ApplicationError } from '../errors';

import {
  Note as TonalNote,
  Chord as TonalChord,
  ChordType as TonalChordType
} from "@tonaljs/tonal";

function firstNumber() {
  return [ ...arguments ].reduce((memo, toCheck) => {
    if (memo === undefined && typeof toCheck === 'number') {
      return toCheck;
    }

    return memo;
  }, undefined);
}

export class ChordModel extends BaseModel {

  static properties = {
    name: {},
    symbol: {},
    pitch: {},
    duration: {},
    octave: {},
    quality: {},
    notes: {},
    root: {},
    tonic: {},
    velocity: {},
  }

  static get chordTypes() {
    return this._chordTypes = this._chordTypes || TonalChordType.all()
      .map((type) => ({
        symbol: type.aliases[0],
        fullName: type.name,
        quality: type.quality,
        intervals: type.intervals,
      }));
  }

  static chordsFor({
    root = 'c4',
    tonic = null,
    quality = null,
  }) {
    return this.chordTypes.reduce((chords, type) => {
      const chord = TonalChord.getChord(type.symbol, tonic || root, root);

      if (
        chord.empty ||
        quality && (chord.quality !== quality)
      ) {
        // skip (for legibility)
      }
      else {
        chords.push(new this({
          name: chord.name.length === 2 ? chord.symbol : chord.name,
          symbol: chord.symbol,
          notes: chord.notes,
          quality: chord.quality,
          root: chord.root,
          tonic: chord.tonic,
          octave: null,
        }));
      }

      return chords;
    }, [])
      .sort((a, b) => ((a.name < b.name) ? -1 : 1));
  }

  static getDefinition({
    symbol = null,
    tonic = null,
    root = null,
    pitch = null,
    octave = null,
  }) {
    let definition = null;

    if (tonic && root) {
      definition = TonalChord.getChord(symbol, tonic, root);
    }
    else if (root && !tonic) {
      definition = TonalChord.getChord(symbol, root, root);
    }
    else if (!root && tonic) {
      definition = TonalChord.getChord(symbol, tonic, tonic);
    }
    else if (pitch && octave) {
      const inferredTonic = `${pitch}${octave}`;
      const inferredRoot = inferredTonic;

      definition = TonalChord.getChord(symbol, inferredTonic, inferredRoot);
    }
    else if (pitch) {
      definition = TonalChord.getChord(symbol, pitch, pitch);
    }
    else {
      definition = TonalChord.get(symbol);
    }

    // console.log(`symbol = ${symbol}; tonic = ${tonic}; root = ${root}; pitch = ${pitch}; octave = ${octave}`);
    // console.log(JSON.stringify(definition, null, 2));

    return definition.empty || !definition.tonic ? null : definition;
  }

  static parse(properties) {
    const { symbol, root, tonic, pitch, octave } = properties;
    const definition = this.getDefinition({ symbol, root, tonic, pitch, octave });

    if (!definition) {
      throw new ApplicationError(`Unable to interpret chord: ${JSON.stringify(properties)}.`);
    }

    return new this(Object.assign({}, properties, {
      name: definition.name,
      symbol: definition.symbol,
      notes: definition.notes,
      quality: definition.quality,
      root: definition.root,
      tonic: definition.tonic,
    }));
  }

  toNotes() {
    return this.notes.map((note) => (NoteModel.parse({
      pitch: note,
      duration: this.duration,
      octave: this.octave,
      velocity: this.velocity,
    })))
  }

}

ChordModel.init();