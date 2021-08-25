session('play a single note', async ({ session }) => {

  session.instrument('bass', async () => {
    return new Tone.MonoSynth();
  });

  session.track('bass', async ({ track }) => {
    track.at(0, 0, 0).play(quarter.note('c1'));
  });

  session.send.instrument('bass').to.track('bass');
  session.send.track('bass').to.main();

});
