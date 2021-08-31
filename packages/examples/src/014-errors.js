session('play a single note', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.MonoSynth();
  });

  session.track('bass', async ({ track }) => {
    track.at(0, 0, 0).play(quarter.note('c1'));
  });

  // Missing input
  session.send.instrument('trumpet').to.track('bass');
  session.send.instrument('bass').to.track('track-missing');
  
  // Missing trach
  session.send.track('missing-track').to.main();

});
