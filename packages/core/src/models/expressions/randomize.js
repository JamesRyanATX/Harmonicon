import { oneOf } from '@composer/util';

export const randomizeExpression = {
  options: {
    property: null,
    values: [],
  },
  fn: ({ source, options: { property, values } }) => {
    return source.map((note) => {
      return note.clone({ [property]: oneOf(values) }).sanitize();
    });
  }
};