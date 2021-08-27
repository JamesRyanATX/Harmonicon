session('library', ({ session }) => {
  session.use.instrument('electric-bass').from.library('core');

  session.phrase('bass-line', ({ phrase }) => {
    phrase.steps(
      quarter.note('c2'),
      eighth.note('d2'),
      eighth.note('e2'),
      eighth.note('f2'),
      eighth.note('g2'),
      eighth.note('a2'),
      eighth.note('b2'),
      quarter.note('c3')
    );
  });

  session.track('electric-bass', async ({ track }) => {
    track.at(0, 0, 0).play.phrase('bass-line');
  });

  session.send.instrument('electric-bass').to.track('electric-bass');
  session.send.track('electric-bass').to.main();

});