session('multitrack', async ({ session }) => {
  session.at.measure(0)
    .meter([ 4, 4 ])
    .tempo(100)
    .swing(0)
    .key('c')
    .scale('phrygian'); // ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];

  session.instrument('mono-synth', async () => {
    return new Tone.AMSynth();
  });

  session.instrument('membrane-synth', async () => {
    return new Tone.PolySynth();
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      eighth.note(0),
      eighth.note(-1),
      eighth.note(-2),
      eighth.note(-3),
      eighth.note(-4),
      eighth.note(-5),
      eighth.note(-6),
      eighth.note(-7),
    );
  });

  session.track('mono-synth', async ({ track }) => {
    track.at(0, 0, 0).play.phrase('walk-the-relative-scale');
  });

  session.track('membrane-synth', async ({ track }) => {
    track.at(0, 2, 0).play.phrase('walk-the-relative-scale');
  });

  session.send.instrument('mono-synth').to.track('mono-synth');
  session.send.instrument('membrane-synth').to.track('membrane-synth');
  session.send.track('mono-synth').to.main();
  session.send.track('membrane-synth').to.main();

});
