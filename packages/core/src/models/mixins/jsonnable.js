import { BaseModelMixin } from './base';
import { BaseModel } from '../base';
import { Collection } from "../../util/collection";

export const jsonnable = Base => class extends BaseModelMixin(Base) {

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
          if (typeof r === 'object') { // Object representation
            return deep ? r.toJSON() : r.id;
          }
          else { // String ID representation
            return r;
          }
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