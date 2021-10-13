import { BaseModel } from './base.js';
import { storable } from "./mixins.js";
import { v4 as uuidv4 } from 'uuid';

export class FileModel extends storable(BaseModel) {

  static properties = {
    id: {
      type: String,
      defaultValue: () => (uuidv4()),
    },
    workspace: {
      json: (v) => (v.id),
    },
    name: {},
    source: {},
    type: {
      defaultValue: 'text/javascript'
    },

    // Cached raw waveform of session (not stored)
    waveform: {
      type: Array,
      defaultValue: null,
      json: false,
    },

    // Cached length of session (not stored)
    duration: {
      type: Number,
      defaultValue: 0,
      json: false,
    },

  }

  get storage () {
    return this.workspace.storage;
  }

}

FileModel.init();