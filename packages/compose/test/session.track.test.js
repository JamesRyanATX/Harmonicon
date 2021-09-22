import { session, SessionComposer, TrackComposer } from '../';

describe('track', function () {
  it('creates a track', function () {
    const result = session('my-song', function ({ session }) {
      session.track('bass', function ({ track, session }) {
        expect(track).toBeInstanceOf(TrackComposer)
        expect(session).toBeInstanceOf(SessionComposer)
      });
    });

    expect(result.model.tracks.length).toEqual(1);
  });
});