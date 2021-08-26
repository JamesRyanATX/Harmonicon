session('a clean bass', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.Synth({
      volume: 0,
      detune: 0,
      portamento: 0,
      envelope: {
        attack: 1,
        attackCurve: "exponential",
        decay: 0,
        decayCurve: "exponential",
        release: 20.5,
        releaseCurve: "exponential",
        sustain: 1
      },
      oscillator: {
        partialCount: 0,
        partials: [],
        phase: 0,
        type: "sine",
        harmonicity: 0,
        modulationType: "sine"
      }
    }).toDestination();
  });

  session.phrase('progression', ({ phrase }) => {
    phrase.steps([
      quarter.note('E1'),
      quarter.note('E2'),
      quarter.note('F#1'),
      quarter.note('F#2'),
      quarter.note('G#1'),
      quarter.note('G#2'),
      quarter.note('A1'),
      quarter.note('A2'),
    ]);
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(0).play.phrase('progression');
  });

  session.send.instrument('bass').to.track('bass');
  session.send.track('bass').to.main();

});