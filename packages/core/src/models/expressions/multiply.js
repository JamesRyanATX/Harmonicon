import { times } from '@composer/util';

export const multiplyExpression = {
  options: {
    n: 5,
  },
  fn: ({ source, options: { n } }) => {
    const iterations = times(n, (i) => (i));

    return iterations.reduce((notes) => {
      return notes.concat(source.map((s) => (s.clone())));
    }, []);
  }
};