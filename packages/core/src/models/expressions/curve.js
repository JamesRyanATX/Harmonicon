import { Range as TonalRange } from '@tonaljs/tonal';

const propertyCurves = {};

propertyCurves.pitch = ({ source, options: {
  property,
  from = null,
  to,
  shape = 'linear',
  chromatic = true,
} }) => {

  function relative() {
    const min = from === null ? source[0].pitch || 0 : from;
    const max = to;
    const distance = max - min;

    return source.map((note, i) => {

      // Compute the percentage through the curve of the current iteration
      const pct = i / ((source.length - 1) || 1);
      const pitch = chromatic
        ? Math.round((min + (pct * distance)) * 2) / 2
        : Math.round((min + (pct * distance)));

      // console.log(`i=${i} pct=${pct} pitch=${pitch}`);

      return note.clone().setProperties({ pitch }).sanitize();
    });
  }

  function absolute() {
    const rangeFrom = from === null ? source[0].pitch : from;
    const rangeTo = to;
    const range = TonalRange.chromatic([ rangeFrom, rangeTo ]);

    return source.map((note, i) => {
      if (note.relative) {
        throw new TypeError('Pitch curves for relative notes are unsupported at this time.')
      }

      // Compute the percentage through the curve of the current iteration
      const pct = i / ((source.length - 1) || 1);
      const slot = Math.round(pct * (range.length - 1));
      const pitch = range[slot];

      // console.log(`i=${i} pct=${pct} slot=${slot} pitch=${pitch}`);

      return note.clone().setProperties({ pitch }).sanitize();
    });
  }

  if (typeof to === 'number') {
    return relative();
  }
  else {
    return absolute();
  }
}

propertyCurves.velocity = ({ source, options: { property, from = null, to, shape } }) => {

  if (from && (typeof from !== 'number' || from < 0 || from > 1)) {
    throw new TypeError(`Velocity curve origin out of bounds: "${from}"`);
  }

  if (!to || typeof to !== 'number' || to < 0 || to > 1) {
    throw new TypeError(`Velocity curve origin out of bounds: "${from}"`);
  }

  const min = from === null ? source[0].velocity || 0 : from;
  const max = to;
  const distance = max - min;

  return source.map((note, i) => {

    // Compute the percentage through the curve of the current iteration
    const pct = i / ((source.length - 1) || 1);
    const velocity = Math.round((min + (pct * distance)) * 100) / 100;

    // console.log(`i=${i} pct=${pct} velocity=${velocity}`);

    return note.clone().setProperties({ velocity }).sanitize();
  });
}

export const curveExpression = {
  
  options: {
    property: null,
    from: null,
    to: null,
    shape: 'linear',
  },

  fn: ({ source, options: { property, from, to, shape, chromatic } }) => {
    const propertyCurve = propertyCurves[property];

    if (!propertyCurve) {
      throw new TypeError(`Unsupported curve property: "${property}".`)
    }

    if (shape !== 'linear') {
      throw new TypeError(`Unsupported curve shape: "${shape}".`)
    }

    return propertyCurve({ source, options: { property, from, to, shape, chromatic } });
  }

};