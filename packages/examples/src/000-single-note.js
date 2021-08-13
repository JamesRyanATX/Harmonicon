session('single note', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.MonoSynth().toDestination();
  });

  session.track('bass', async ({ track }) => {
    track.at.measure(0).play(quarter.note('c2'));
  });

});
