import { LocalStorageDriver } from '@composer/driver-storage-localstorage';

export class MockStorageDriver extends LocalStorageDriver {
  static data = {};

  get localStorage () {
    return this.constructor.data;
  }

}