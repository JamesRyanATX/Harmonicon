import { Logger } from "./logger";
import { Collection } from "./collection";
import { eventify } from './eventify';

export class Model {
  get loggerGroup () { return 'Util'; }

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

  constructor (properties) {

    // Logger specific to this record
    this.logger = new Logger(`${this.loggerGroup}.${
      this.constructor.loggerName ||
      this.loggerName ||
      this.constructor.name
    }`);

    // Make a copy of original properties object
    this.properties = Object.assign({}, properties);

    // Initialize properties
    this.constructor.forEachProperty((property, definition) => {
      const currentValue = this[property];
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
          records: this.properties[property] || [],
          property: property,
          definition: definition,
        });
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

      if (oldValue !== newValue) {
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

  clone () {
    return new this.constructor(Object.assign({}, this.properties));
  }

  validate() {
    return { errors: [], valid: true };
  }

}

eventify(Model.prototype);