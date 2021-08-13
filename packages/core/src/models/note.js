import { BaseModel } from './base';
import { Note } from "@tonaljs/tonal";

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

  static parse(properties) {
    const pitch = Note.get(properties.pitch);

    properties.pitch = pitch.name;
    properties.octave = pitch.octave;

    return new this(properties);
  }

  computedPitch({ key, scale } = {}) {
    return this.pitch;
  }

  toString() {
    return `${this.pitch} (${this.duration.name})`;
  }

}

NoteModel.init();