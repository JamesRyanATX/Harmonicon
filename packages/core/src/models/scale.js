import Scale from "@tonaljs/scale";
import { BaseModel } from './base';
import { InvalidPropertyError } from '../errors';

export class ScaleModel extends BaseModel {

  static properties = {
    tonic: {},
    type: {},
    name: {},
    notes: {},
    intervals: {},
    aliases: {},
    chroma: {},
    normalized: {},
  }

  static get all () {
    return this._all = this._all || Scale.names().sort();
  }

  static parse({ tonic, type }) {
    const definition = Scale.get(`${tonic} ${type}`);

    if (definition.empty) {
      throw new InvalidPropertyError(`Unable to parse tonic "${tonic}" with type "${type}"`);
    }

    return new this(definition);
  }

  includes(note) {
    return this.notes.indexOf(note) !== -1;
  }

}

ScaleModel.init();