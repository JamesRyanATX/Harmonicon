import { LocalStorageDriver } from '@composer/driver-storage-localstorage';

export class MockStorageDriver extends LocalStorageDriver {
  static data = {};

  get localStorage () {
    return this.constructor.data || {};
  }

  dump () {
    return Object.keys(this.localStorage).reduce((memo, key) => {
      memo[key] = this.decode(this.localStorage[key]);
      return memo;
    }, {});
  }

  inspect() {
    return JSON.stringify(this.dump(), null, 2);
  }

}