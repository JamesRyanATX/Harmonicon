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
    }
  }

  get storage () {
    return this.workspace.storage;
  }

}

FileModel.init();