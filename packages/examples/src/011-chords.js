session('chord structures', ({ session }) => {
  session.use.instrument('piano').from.library('core');

  session.track('piano', async ({ track }) => {
    track.at(0, 0, 0).play.phrase([
      half.note('Cmaj7'),
      half.note('Cmaj7', { octave: 2 }),
      half.note('maj7', { pitch: 'c3' }),
      half.note('maj7', { tonic: 'c2' }),
      half.note('maj7', { tonic: 'c2', root: 'c2' }),
      half.note('maj7', { root: 'c2' }),
    ]);
  });

  session.send.instrument('piano').to.track('piano');
  session.send.track('piano').to.main();
});