import { BaseModel } from './base';
import { NoteModel } from './note';
import { Note, Mode } from "@tonaljs/tonal";

export class KeySignatureModel extends BaseModel {

  static properties = {
    mode: {
      defaultValue: 'major'
    },
    tonic: {
      defaultValue: 'c'
    }
  }

  get definition () {
    return this._definition = this._definition || Mode.get(this.mode, this.tonic);
  }

  get notes () {
    return this._notes = this._notes || Mode.notes(this.mode, this.tonic)
  }

  computeRelativeNote(note) {
    const pitch = this.notes.at(note.pitch % this.notes.length);
    const octaveDelta = Math.floor(note.pitch / this.notes.length);
    const pitchClass = Note.pitchClass(pitch);
    const octave = Note.octave(pitch) + octaveDelta;

    return NoteModel.parse({
      pitch: `${pitchClass}${octave}`
    });
  }
  
  toString () {
    return `${this.tonic} ${this.mode} (${this.notes.join(', ')})`;
  }

}

KeySignatureModel.init();