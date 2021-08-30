import { BaseModelMixin } from './base.js';

export const storable = Base => class extends BaseModelMixin(Base) {

  static async create(properties) {
    const record = this.parse(properties)
    await record.save();
    return record;
  }

  static storageKey(id) {
    return [ this.name.toLowerCase(), id ];
  }

  static async find(id, storage) {
    const properties = await storage.get(this.storageKey(id));

    if (!properties) {
      return null;
    }
    else {
      return this.parse(properties);
    }
  }

  static async findOrCreate(id, properties, storage) {
    return (await this.find(id, storage))
        || (this.create(Object.assign({ id }, properties), storage));
  }

  get storage () {
    throw new Error('Persisted models must have a #storage getter.');
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