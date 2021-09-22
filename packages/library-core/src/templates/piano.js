export const pianoTemplate = ({ library }) => {

  library.template('Piano', ({ template }) => {
    template.source(`

session('my-song', ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(120)
    .swing(0)
    .key('c')
    .scale('major');

  session.use.instrument('piano').from.library();

  session.track('piano', function({ track }) {
    track.at(0).play.phrase([
      whole.note('cmaj7', { octave: 3 })
    ]);
  });

  session.send.instrument('piano').to.track('piano');
  session.send.track('piano').to.main();

});

    `.trim());
  });

};
