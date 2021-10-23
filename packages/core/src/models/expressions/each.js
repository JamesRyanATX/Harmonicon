export const eachExpression = {
  options: {
    fn: (note) => (note),
  },
  fn: ({ source, options: { fn } }) => {
    return source.map((note) => {
      return fn(note.clone()).sanitize();
    });
  }
};