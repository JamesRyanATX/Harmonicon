import { BaseModel } from './base';
import { Mode } from "@tonaljs/tonal";

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
  
  toString () {
    return `${this.tonic} ${this.mode} (${this.notes.join(', ')})`;
  }

}

KeySignatureModel.init();