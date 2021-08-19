import { BaseModel } from './base';
import { v4 as uuidv4 } from 'uuid';

export class FileModel extends BaseModel {

  static properties = {
    id: {
      type: String,
      defaultValue: () => (uuidv4()),
    },
    workspace: {
      persist: false,
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