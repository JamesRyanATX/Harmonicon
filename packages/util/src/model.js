import { Logger } from "./logger";
import { Collection } from "./collection";
import { ModelValidationError } from "./errors";
import { eventify } from './eventify';

import { type } from './model/validators/type';
import { oneOf } from './model/validators/one_of';
import { withinRange } from './model/validators/within_range';
import { validate } from './model/validators/validate';

const defaultPropertyDefinition = {
  validate: false,
  defaultValue: undefined,
  allowNull: true,
}

export class Model {
  get loggerGroup () { return 'Util'; }

  static validators = {
    type, oneOf, withinRange, validate
  }

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

    // Pull in default definition
    this.properties[property] = definition = { ...defaultPropertyDefinition, ...definition };

    Object.defineProperty(this.prototype, property, {
      get: function () {
        return this.properties[property];
      },
      set: function (value) {
        return this.setProperties({ [property]: value });
      }
    });
  }

  static events = {
    allow: [
      'changed'
    ]
  }

  constructor (properties = {}) {
    this.properties = {};

    // Logger specific to this record
    this.logger = new Logger(`${this.loggerGroup}.${
      this.constructor.loggerName ||
      this.loggerName ||
      this.constructor.name
    }`);

    // Initialize properties
    this.constructor.forEachProperty((property, definition) => {
      const currentValue = properties[property];
      const defaultValue = definition.defaultValue;

      // Register associated events
      this.allow(`changed:${property}`);

      // Apply default value
      if (currentValue === undefined && defaultValue !== undefined) {
        this.properties[property] = (typeof defaultValue === 'function')
          ? defaultValue.call(this, this.properties)
          : defaultValue;
      }
      
      // Initialize collection
      else if (definition.collection) {
        this.properties[property] = new Collection({
          obj: this,
          type: definition.type,
          records: properties[property] || [],
          property: property,
          definition: definition,
        });
      }

      // Assign normal property without emitting change event
      else {
        this.setProperties({ [property]: currentValue }, { emit: false });
      }
    });

    // Allow generic events
    this.constructor.events.allow.map(this.allow.bind(this));

  }

  setProperties(properties = {}, {
    emit = true
  } = {}) {
    const changes = [];

    Object.entries(properties).forEach(([ property, newValue ]) => {
      const oldValue = this[property];

      if (oldValue !== newValue && this.validateProperty(property, newValue)) {
        this.properties[property] = newValue;
        
        if (emit) {
          changes.push({ property, oldValue, newValue });
          this.emit(`changed:${property}`, { property, oldValue, newValue });
        }
      }
    });

    if (changes.length > 0) {
      this.emit('changed', { changes });
    }

    return this;
  }

  clone (properties = {}) {
    return new this.constructor({ ...this.properties, ...properties });
  }

  validateProperty(property, value) {
    const definition = this.constructor.properties[property];

    // validate: () => { ...
    if (typeof definition.validate === 'function') {
      definition.validate(value);
    }

    // Early return if null is allowed
    if (value === null && definition.allowNull) {
      return true;
    }

    // Standard validators
    else {
      Object.entries(this.constructor.validators).forEach(([ validator, fn ]) => {
        if (definition[validator]) {
          fn({ record: this, property, value, definition });
        }
      });
    }

    return true;
  }

  validate() {
    return { errors: [], valid: true };
  }

}

eventify(Model.prototype);