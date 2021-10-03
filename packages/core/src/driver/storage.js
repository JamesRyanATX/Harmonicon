import { BaseDriver } from './base';

export class Driver extends BaseDriver {

  async test () {
    this.logger.error('test() not implemented');
  }

  async list () {
    this.logger.error('list() not implemented');
  }

  async get (key, fn) {
    this.logger.error('get() not implemented');
  }

  async set (key, value) {
    this.logger.error('set() not implemented');
  }

  async unset (key) {
    this.logger.error('unset() not implemented');
  }

  async exists (key) {
    this.logger.error('exists() not implemented');
  }

}