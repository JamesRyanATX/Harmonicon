import { ModelValidationError } from '../../errors';

function isANumber(value) {
  return Number.isFinite(value);
}

function isAString(value) {
  return typeof value === 'string';
}

function isAnArray(value) {
  return Array.isArray(value);
}

function isABoolean(value) {
  return value === true || value === false;
}

function isA(type, value) {
  const custom = {
    [Array]: isAnArray,
    [Number]: isANumber,
    [String]: isAString,
    [Boolean]: isABoolean,
  }[type];

  return custom ? custom(value) : (value instanceof type);
}

export function type({ property, value, definition }) {
  const type = definition.type;

  if (!isA(type, value)) {
    console.error(new Error('test'))
    throw new ModelValidationError(`${property} must be a kind of ${type.name}; got "${typeof value}"`);
  }

  return true;
}