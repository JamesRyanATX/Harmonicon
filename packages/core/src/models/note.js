import { BaseModel } from './base';
import { Note } from "@tonaljs/tonal";

function pitchIsRelative(pitch) {
  return !!String(pitch).match(/^-{0,1}[0-9]+\.{0,1}[0-9]*/);
}

export class NoteModel extends BaseModel {

  static properties = {
    pitch: {
      defaultValue: 0
    },
    duration: {
    },
    octave: {
      defaultValue: 4
    }
  }

  get definition () {
    return this._definition = this._definition || Note.get(this.pitch);
  }

  get relative () {
    return pitchIsRelative(this.pitch);
  }

  static parse(properties) {
    if (pitchIsRelative(properties.pitch)) {
      properties.pitch = Number(properties.pitch);
    }
    else {
      const abcPitch = Note.get(properties.pitch);

      properties.pitch = abcPitch.name;
      properties.octave = abcPitch.octave;  
    }

    return new this(properties);
  }

  computedPitch(keySignature) {
    if (this.relative) {
      const pitch = keySignature.notes[this.pitch % keySignature.notes.length];
      const octaveDelta = Math.floor(this.pitch / keySignature.notes.length);
      const pitchClass = Note.pitchClass(pitch);
      const octave = Note.octave(pitch) + octaveDelta;

      return `${pitchClass}${octave}`;
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