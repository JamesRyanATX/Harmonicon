import { BaseModel } from './base';
import { FileModel } from './file';

import { storable } from './mixins';

export class WorkspaceModel extends storable(BaseModel) {

  static properties = {

    id: {
      defaultValue: 'default'
    },

    // Tabs in the UI
    files: {
      type: FileModel,
      collection: true,
    },

    // Audio driver (tone, mock, etc.)
    audio: {
      json: false,
    },

    // Storage driver (localstorage, mock, etc.)
    storage: {
      json: false,
    }

  }

  static async load (id, storage) {
    const workspace = await this.find(id, storage);
    const files = workspace.properties.files.records;

    for (let i = 0; i < files.length; i += 1) {
      files[i] = await FileModel.find(files[i], storage);
    }

    return workspace;
  }
}

WorkspaceModel.init();