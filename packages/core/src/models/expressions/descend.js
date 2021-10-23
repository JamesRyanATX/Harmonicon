import { curveExpression } from './curve';

export const descendExpression = {
  options: {
    to: null,
    chromatic: true,
    shape: 'linear'
  },
  fn: ({ source, options }) => {
    options.property = 'pitch';

    return curveExpression.fn({ source, options });
  }
};