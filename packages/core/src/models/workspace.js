import { BaseModel } from './base';
import { SessionModel } from './session';

export class WorkspaceModel extends BaseModel {

  static properties = {

    sessions: {
      type: SessionModel,
      collection: true,
    },

    // Audio driver (tone, mock, etc.)
    audio: {},

    // Storage driver (localstorage, mock, etc.)
    storage: {}

  }

}

SessionModel.init();