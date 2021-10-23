export const cycleExpression = {
  options: {
    property: null,
    values: [],
    reverse: false,
  },
  fn: ({ source, options: { values, property, reverse } }) => {
    return source.map((note, i) => {
      return note.clone({
        [property]: reverse
          ? values[(values.length - 1) - (i % values.length)]
          : values[i % values.length]
      }).sanitize();
    });
  }
};