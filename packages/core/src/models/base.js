import { Collection } from "../util/collection";
import { Logger } from "../util/logger";

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
    this.defaultProperties = {};

    this.forEachProperty((property, definition) => {
      if (!definition.collection) {
        this.defineModelProperty(property, definition);
      }
    });
  }

  /**
   * Bootstrap a single property or collection
   */
  static defineModelProperty(property, definition) {
    this.defaultProperties[property] = definition.defaultValue;

    Object.defineProperty(this.prototype, property, {
      get: function () {
        return this.properties[property];
      }
    });
  }

  constructor (properties) {
    this.logger = new Logger(this.constructor.name);
    this.properties = Object.assign({}, this.constructor.defaultProperties, properties);

    this.constructor.forEachProperty((property, definition) => {
      if (definition.collection) {
        this[property] = new Collection(this, this.properties[property] || []);
      }
    });
  }

  clone () {
    return new this.constructor(Object.assign({}, this.properties));
  }

  toJSON () {
    return Object.keys(this.properties).reduce((json, property) => {
      const definition = this.constructor.properties[property];
      const value = this[property];

      json[property] = typeof value;

      return json;
    }, {
      type: this.constructor.name.toString()
    });
  }

}