import { BaseModelMixin } from './base.js';
import { config } from '../../config';

export const storable = Base => class extends BaseModelMixin(Base) {

  static get storage () {
    return config.drivers.storage;
  }

  get storage () {
    return this.constructor.storage;
  }

  static async create(properties) {
    const record = this.parse(properties)
    await record.save();
    return record;
  }

  static storageKey(id) {
    return [ this.name.toLowerCase(), id ];
  }

  static async find(id) {
    const properties = await this.storage.get(this.storageKey(id));

    if (!properties) {
      return null;
    }
    else {
      return this.parse(properties);
    }
  }

  static async findOrCreate(id, properties) {
    return (await this.find(id))
        || (this.create(Object.assign({ id }, properties)));
  }

  get storageKey () {
    return this.constructor.storageKey(this.id);
  }

  async save() {
    return this.storage.set(this.storageKey, this.toJSON({ deep: false }))
      .then(() => (true));
  }

  async destroy() {
    return this.storage.unset(this.storageKey);
  }

}

