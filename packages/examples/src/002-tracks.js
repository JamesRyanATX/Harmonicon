import { session, quarter } from '@composer/compose';

composition('002-tracks', async ({ session }) => {
  session.at(0, 0, 0)
    .meter([ 4, 4 ])
    .tempo(100)
    .swing(0.4)
    .key('c')
    .scale('major')

  session.instrument('bass', async () => {
    return new Tone.MembraneSynth().toDestination();
  });

  session.instrument('lead', async () => {
    return new Tone.MembraneSynth().toDestination();
  });

  session.track('bass', async ({ track }) => {
    track.at(0, 0, 0).play(quarter.note(0));
  });

  session.track('lead', async ({ track }) => {
    track.at(0, 1, 0).play(quarter.note(2));
  });
});
