export function validate({ value, definition }) {
  return definition.validate(value);
}