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
  const types = Array.isArray(definition.type) ? definition.type : [ definition.type ];
  const isValid = types.reduce((isValid, type) => {
    return isValid || isA(type, value);
  }, false);

  if (!isValid) {
    throw new ModelValidationError(
      `${property} must be a kind of ${types.map((t) => (t.name)).join(' or ')}; got "${typeof value}"`
    );
  }

  return true;
}