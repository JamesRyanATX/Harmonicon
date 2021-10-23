export const bounceExpression = {
  options: {
    property: null,
    values: [],
  },
  fn: ({ source, options: { property, values} }) => {
    let descending = false;
    let position = 0;

    return source.map((original, i) => {
      const note = original.clone({
        [property]: values[position]
      }).sanitize();

      // End of range; begin descending
      if (position === values.length - 1) {
        position -= 1;
        descending = true;
      }

      // Beginning of range
      else if (position === 0) {
        position = 1;
        descending = false;
      }

      // Mid-range
      else {
        position += (descending) ? -1 : 1;
      }

      return note;
    });
  }
};