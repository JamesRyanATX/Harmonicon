export function oneOf({ record, property, value, definition }) {
  if (definition.oneOf.indexOf(value) === -1) {
    throw new TypeError(`${property} must be one of: ${definition.oneOf.join(', ')}`);
  }

  return true;
}