session('c major scale', async ({ session }) => {
  session.at.measure(0)
    .meter([ 4, 4 ])
    .tempo(100)
    .swing(0)
    .key('c')
    .scale('mixolydian'); // ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];

  session.instrument('bass', async () => {
    return new Tone.MonoSynth().toDestination();
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note('0'),
      eighth.note('1'),
      eighth.note('2'),
      eighth.note('3'),
      eighth.note('4'),
      eighth.note('5'),
      eighth.note('6'),
      half.note('7')
    );
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(0)
      .volume(1)
      .pan(-0.5)
      .mute(false)
      .solo(false);

    track.at.measure(0).play.phrase('walk-the-relative-scale');
  });

});
