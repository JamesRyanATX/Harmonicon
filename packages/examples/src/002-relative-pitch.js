session('c major scale', async ({ session }) => {
  session.at.measure(0)
    .meter([ 4, 4 ])
    .tempo(160)
    .swing(0)
    .key('d')
    .scale('minor'); // ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];

  session.instrument('bass', async () => {
    return new Tone.MembraneSynth();
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note(0),
      eighth.note(1),
      eighth.note(2),
      eighth.note(3),
      eighth.note(4),
      eighth.note(5),
      eighth.note(6),
      quarter.note(7),
      eighth.note(6),
      eighth.note(5),
      eighth.note(4),
      eighth.note(3),
      eighth.note(2),
      eighth.note(1),
      quarter.note(0),
      eighth.note(-1),
      eighth.note(-2),
      eighth.note(-3),
      eighth.note(-4),
      eighth.note(-5),
      eighth.note(-6),
      half.note(-7)
    );
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(0).play.phrase('walk-the-relative-scale');
  });

  // Route instrument to tracks
  session.send.instrument('bass').to.track('bass');

  // Send track to main
  session.send.track('bass').to.main();

});
