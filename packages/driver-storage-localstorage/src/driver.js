import { StorageDriver } from '@composer/core';

export class Driver extends StorageDriver.Driver {

  get prefix () {
    return this.options.prefix || 'composer';
  }

  get localStorage () {
    return window ? window.localStorage : {};
  }

  key(parts) {
    return [
      this.prefix,
    ].concat(Array.isArray(parts) ? parts : [ parts ]).join(':');
  }

  decode (data) {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    else {
      return null;
    }
  }

  encode(data) {
    return JSON.stringify(data);
  }

  async exists(key) {
    return typeof this.localStorage[this.key(key)] !== 'undefined';
  }

  async get(key, fn) {
    if (fn && !(await this.exists(key))) {
      await this.set(key, await fn());
    }

    return this.decode(this.localStorage[this.key(key)]);
  }

  async set(key, data) {
    return this.localStorage[this.key(key)] = this.encode(data);
  }

  async unset(key) {
    return (delete this.localStorage[this.key(key)]);
  }

  async list () {
    return Object.keys(this.localStorage).filter((key) => {
      return key.indexOf(`${this.prefix}:`) === 0;
    });
  }

  dump () {
    return Object.keys(this.localStorage).reduce((memo, key) => {
      const value = this.localStorage[key];

      try {
        memo[key] = this.decode(value);
      }
      catch {
        memo[key] = value;
      }

      return memo;
    }, {});
  }

  inspect() {
    return JSON.stringify(this.dump(), null, 2);
  }

}