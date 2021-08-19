import { BaseModel } from './base';
import { FileModel } from './file';

export class WorkspaceModel extends BaseModel {

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
      persist: false,
    },

    // Storage driver (localstorage, mock, etc.)
    storage: {
      persist: false,
    }

  }

  // static async find  () {
  //   await this.files.load();

  //   if ()
  //   // const sessions = await this.storage.get('sessions', () => {
  //   //   return [ {
  //   //     source: 'console.log("ok")'
  //   //   } ]
  //   // });

  //   // sessions.forEach((session) => {
  //   //   console.debug(session)
  //   //   this.sessions.add(SessionModel.parse(session))
  //   // });

  //   this.logger.debug(`loaded ${this.files.length} file(s)`);
  // }

}

WorkspaceModel.init();