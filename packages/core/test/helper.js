import { Harmonicon } from '../';
import * as MockStorageDriver from './mocks/drivers/storage';
import * as MockAudioDriver from './mocks/drivers/audio';

beforeEach(async () => {
  return Harmonicon.initialize({
    drivers: {
      storage: new MockStorageDriver.Driver(),
      audio: new MockAudioDriver.Driver()
    }
  });
});