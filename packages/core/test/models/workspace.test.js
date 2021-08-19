import { FileModel } from '../../';
import { WorkspaceModel } from '../../src/models/workspace';
import { MockStorageDriver } from '@composer/driver-storage-mock';
import { MockAudioDriver } from '@composer/driver-audio-mock';

describe('WorkspaceModel', function () {

  describe('#findOrCreate', function () {
    it('creates a default workspace', async function () {
      const storage = new MockStorageDriver();
      const audio = new MockAudioDriver();
      const workspace = await WorkspaceModel.findOrCreate('default', { storage, audio }, storage);
      
      console.log(workspace.toJSON());
      expect(workspace.files.length).toEqual(1);
    });
  });

});