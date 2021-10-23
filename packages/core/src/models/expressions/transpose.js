export const transposeExpression = {
  options: {
    interval: '0M',
  },
  fn: ({ source, options: { interval } }) => {
    return source.map((note) => {
      return note.transpose(interval);
    });
  }
};