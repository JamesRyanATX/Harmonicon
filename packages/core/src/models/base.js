import { Collection } from "../util/collection";
import { Logger } from "../util/logger";

export class BaseModel {

  static parse (properties) {
    return new this(properties);
  }

  static async create(properties) {
    const record = this.parse(properties)
    await record.save();
    return record;
  }

  static forEachProperty (fn) {
    Object.keys(this.properties).forEach((property) => {
      fn(property, this.properties[property]);
    });
  }

  /**
   * Bootstrap model properties and getters/setters
   */
  static init () {
    this.forEachProperty((property, definition) => {
      this.defineModelProperty(property, definition);
    });
  }

  /**
   * Bootstrap a single property or collection
   */
  static defineModelProperty(property, definition) {
    Object.defineProperty(this.prototype, property, {
      get: function () {
        return this.properties[property];
      }
    });
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

  get storageKey () {
    return this.constructor.storageKey(this.id);
  }

  constructor (properties) {
    this.logger = new Logger(this.constructor.name);
    this.properties = Object.assign({}, properties);

    this.constructor.forEachProperty((property, definition) => {
      const currentValue = this[property];
      const defaultValue = definition.defaultValue;

      // Apply default value
      if (typeof currentValue === 'undefined' && defaultValue) {
        this.properties[property] = (typeof defaultValue === 'function')
          ? defaultValue.call(this, this.properties)
          : defaultValue;
      }
      
      // Initialize collection
      else if (definition.collection) {
        this.properties[property] = new Collection({
          obj: this,
          type: definition.type,
          records: this.properties[property] || []
        });
      }
    });
  }

  clone () {
    return new this.constructor(Object.assign({}, this.properties));
  }

  toJSON ({
    deep = false
  } = {}) {
    return Object.keys(this.properties).reduce((json, property) => {
      const definition = this.constructor.properties[property];
      const value = this[property];

      if (value instanceof Collection) {
        json[property] = value.records.map((r) => (r.id));
      }
      else if (value instanceof BaseModel) {
        json[property] = deep ? value : { id: value.id };
      }
      else if (definition.persist !== false) {
        json[property] = value;
      }

      return json;
    }, {});
  }

  async save() {
    return this.storage.set(this.storageKey, this.toJSON({ deep: false }))
      .then(() => (true));
  }

}