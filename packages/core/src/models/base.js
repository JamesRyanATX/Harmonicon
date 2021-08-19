import { Logger } from "@composer/util";
import { Collection } from "../util/collection";

export class BaseModel {

  static parse (properties) {
    return new this(properties);
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

  setProperties(properties = {}) {
    Object.assign(this.properties, properties);
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

      // If definition has json function, it overrides all
      if (typeof definition.json === 'function') {
        json[property] = definition.json(value, this);
      }

      // Handle collections
      else if (value instanceof Collection) {
        json[property] = value.records.map((r) => {
          return deep ? r.toJSON() : r.id;
        });
      }

      // Include child model JSON (deep=true) or ID (deep=false)
      else if (value instanceof BaseModel) {
        json[property] = deep ? value.toJSON() : value.id;
      }

      // Properties with json: false are excluded
      else if (definition.json !== false) {
        json[property] = value;
      }

      return json;
    }, {});
  }

}