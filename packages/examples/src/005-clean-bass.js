session('Durations', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.Synth({
      volume: 0,
      detune: 0,
      portamento: 0.5,
      envelope: {
        attack: 0.5,
        attackCurve: "exponential",
        decay: 0,
        decayCurve: "exponential",
        release: 1.5,
        releaseCurve: "exponential",
        sustain: 0.2
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "sine",
        harmonicity: 0.5,
        modulationType: "sine"
      }
    }).toDestination();
  });

  session.phrase('progression', ({ phrase }) => {
    phrase.steps([
      whole.note('E1'),
      whole.note('G2'),
      whole.note('G1'),
      whole.note('A1'),
      whole.note('B1'),
      whole.note('C2'),
    ]);
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(1).play.phrase('progression');
  });

});