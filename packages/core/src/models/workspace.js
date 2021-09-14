import { BaseModel } from './base.js';
import { FileModel } from './file.js';
import { storable } from './mixins.js';

export class WorkspaceModel extends storable(BaseModel) {

  static properties = {

    id: {
      defaultValue: 'default'
    },

    // Currently selected file
    selectedFile: {
      defaultValue: null
    },

    // Tabs in the UI
    files: {
      type: FileModel,
      collection: true,
      foreignKey: 'workspace',
    },

    // Configuration for tool panels in UI
    panels: {
      type: Object,
      defaultValue: () => ({
        library: {
          enabled: true,
        },
        routes: {
          enabled: true,
        },
        chords: {
          enabled: true,
        },
        keyboard: {
          enabled: true,
        },
      })
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

  static async loadOrCreate (id, properties, storage) {
    const workspace = await this.findOrCreate(id, properties, storage);
    const files = workspace.properties.files.records;

    for (let i = 0; i < files.length; i += 1) {
      files[i] = await FileModel.find(files[i], storage);
      files[i].setProperties({ workspace });
    }

    return workspace;
  }
}

WorkspaceModel.init();