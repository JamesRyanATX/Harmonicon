export const arpeggiationDemo = ({ library }) => {

  library.demo('Arpeggiation', ({ demo }) => {
    demo.source(`

function arpeggiate({
  pool = null,
  unit = sixteenth,
  beats = 4,
  fn = () => (0),
  direction = 'ascending' // ascending|descending|bounce|random|custom
}) {
  const directions = {
    ascending: ({ max, i }) => {
      return i % (max + 1);
    },
    descending: ({ max, i }) => {
      return max - (i % (max + 1));
    },
    bounce: ({ steps, pool, max, i }) => {
      return ((Math.floor(steps.length / pool.length)) % 2) // should descend?
        ? directions.descending({ max, i })
        : directions.ascending({ max, i });
    },
    random: ({ max }) => {
      return Math.round(Math.random() * max);
    },
    custom: fn
  };

  const notes = (beats / 4) / unit.unit.toDecimal();
  const steps = [];
  const min = 0;
  const max = pool.length - 1;
  const indexFor = directions[direction];

  if (!indexFor) {
    throw new Error(\`Arpeggiator: direction "${direction}" not supported; must be one of ${Object.keys(directions).join(', ')}\`);
  }

  while (steps.length < notes) {
    const c = indexFor({ steps, pool, min, max, i: steps.length });
    
    if (c < min || c > max) {
      throw new Error(\`Arpeggiator: note ${c} out of bounds; must be between ${min} and ${max}\`);
    }

    steps.push(unit.note(pool[c]));
  }

  return steps;
}

session('c major scale', ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(160)
    .swing(0)
    .key('d')
    .scale('minor');

  session.use('core.instrument.poly-synth', {
    volume: -10
  }).as('synth');

  session.track('synth', ({ track }) => {
    [
      'ascending',
      'descending',
      'bounce',
      'random',
    ].forEach((direction, i) => {
      track.at(i * 2, 0, 0).play.phrase(
        arpeggiate({
          pool: [ -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ],
          beats: 8,
          unit: thirtySecond,
          direction: direction,
        })
      );
    });
  });

  session.send.instrument('synth').to.track('synth');
  session.send.track('synth').to.main();
});


    `.trim());
  });

};
