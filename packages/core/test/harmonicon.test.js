import { Harmonicon } from '../src/harmonicon';
import { MockAudioDriver } from '@composer/driver-audio-mock';
import { MockStorageDriver } from '@composer/driver-storage-mock';
import { WorkspaceModel } from '../src/models/workspace';
import { LibraryModel } from '../src/models/library';

describe('Harmonicon', function () {

  beforeEach(() => {
    Harmonicon.teardown();
  })

  describe('#initialize', function () {
    it('runs', async function () {
      const library = LibraryModel.parse({
        name: 'test'
      });
      const libraries = [ { name: library.name, model: library } ];
      const drivers = {
        audio: new MockAudioDriver(),
        storage: new MockStorageDriver(),
      };

      const workspace = await Harmonicon.initialize({ drivers, libraries });

      expect(Harmonicon.drivers.audio).toEqual(drivers.audio);
      expect(Harmonicon.drivers.storage).toEqual(drivers.storage);
      expect(Harmonicon.libraries.test).toEqual(library);

      expect(workspace).toBeInstanceOf(WorkspaceModel);
    });
  });  
});