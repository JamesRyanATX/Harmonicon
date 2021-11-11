import { ModelValidationError } from '../../errors';

export function withinRange({ property, value, definition }) {
  const min = definition.withinRange[0];
  const max = definition.withinRange[1];

  if (value < min || value > max) {
    throw new ModelValidationError(`${property} must be between ${min} and ${max}; got ${value}`);
  }

  return true;
}