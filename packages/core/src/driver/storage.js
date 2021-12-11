import { BaseDriver } from './base';
import { DriverError } from '../errors';

export class Driver extends BaseDriver {
  get loggerGroup() { return 'StorageDriver'; }
  get loggerName() { return 'Driver'; }

  /**
   * Get authentication URL for OAuth2 flow.
   * 
   * @param {object} options 
   * @param {string} options.returnPath - URL to return user to post-authorization
   */
  getAuthenticationUrl({
    returnPath = '/'
  } = {}) {
    throw new DriverError('#getAuthenticationUrl() not implemented');
  }

  test () {
    throw new DriverError('#test() not implemented');
  }

  list () {
    throw new DriverError('#list() not implemented');
  }

  get (key, fn) {
    throw new DriverError('#get() not implemented');
  }

  set (key, value) {
    throw new DriverError('#set() not implemented');
  }

  unset (key) {
    throw new DriverError('#unset() not implemented');
  }

  exists (key) {
    throw new DriverError('#exists() not implemented');
  }

}