import { session, SessionComposer, TrackComposer } from '../';

describe('track', function () {
  it('creates a track', async function () {
    const result = await session('my-song', async function ({ session }) {
      session.track('bass', async function ({ track, session }) {
        expect(track).toBeInstanceOf(TrackComposer)
        expect(session).toBeInstanceOf(SessionComposer)
      });
    });

    expect(result.model.tracks.length).toEqual(1);
  });
});