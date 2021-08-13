session('c major scale', async ({ session }) => {
  session.at.measure(0)
    .meter([ 4, 4 ])
    .tempo(150)
    .swing(0.4)
    .key('c')
    .scale('major');

  session.instrument('bass', async () => {
    return new Tone.MonoSynth().toDestination();
  });

  session.phrase('walk-the-abc-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note('c2'),
      eighth.note('d2'),
      eighth.note('e2'),
      eighth.note('f2'),
      eighth.note('g2'),
      eighth.note('a2'),
      eighth.note('b2'),
      half.note('c3')
    );
  });

  session.phrase('walk-the-relative-scale', ({ phrase }) => {
    phrase.steps(
      quarter.note('r0'), // r0 is short-hand for root note of scale
      eighth.note('r1'),
      eighth.note('r2'),
      eighth.note('r3'),
      eighth.note('r4'),
      eighth.note('r5'),
      eighth.note('r6'),
      half.note('r0', { octave: '+1' })
    );
  });

  // Create a track for bass
  session.track('bass', async ({ track }) => {
    track.at.measure(0)
      .volume(1)
      .pan(-0.5)
      .mute(false)
      .solo(false);

    track.at.measure(0).play.phrase('walk-the-abc-scale');
    track.at.measure(2).play.phrase('walk-the-relative-scale');
  });

  // Route instruments to tracks
  session.send.instrument('bass').to.track('bass');

});
