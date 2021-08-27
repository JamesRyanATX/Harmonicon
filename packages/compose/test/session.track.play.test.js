import { PositionModel } from '@composer/core';
import { quarter, session } from '../';

async function testTrack(fn) {
  const results = {};

  await session('my-song', async function ({ session }) {
    session.instrument('bass', async function () {
      return 'i am instrument';
    });

    session.phrase('a-phrase', ({ phrase }) => {
      phrase.steps(
        quarter.note(0),
        quarter.note(1),
        quarter.note(2),
        quarter.note(3),
      );
    })

    session.track('bass', async ({ track }) => {
      results.track = track;
      results.session = session;

      return fn({ track });
    });
  });

  return results;
}

describe('session.track.play', function () {
  it('sequences single notes', async function () {
    const { track } = await testTrack(({ track }) => {
      track.at(0, 0, 0).play(quarter.note(0));
    });

    expect(track.model.events.length).toEqual(1);
  });

  it('sequences phrases by name', async function () {
    const { track } = await testTrack(({ track }) => {
      track.at(0, 0, 0).play.phrase('a-phrase');
    });

    expect(track.model.events.length).toEqual(1);

    const event = track.model.events.first();

    expect(event.at).toBeInstanceOf(PositionModel);
    expect(event.at.measure).toEqual(0);
    expect(event.at.beat).toEqual(0);
    expect(event.at.subdivision).toEqual(0);
    expect(event.type).toEqual('phrase');
    expect(event.value).toEqual('a-phrase');
  });

  it('sequences anonymous phrases', async function () {
    const { track } = await testTrack(({ track }) => {
      track.at(0, 0, 0).play.phrase([
        quarter.note(0),
        quarter.note(1),
        quarter.note(2),
        quarter.note(3),
      ]);
    });

    expect(track.model.events.length).toEqual(1);

    const event = track.model.events.first();

    expect(event.at).toBeInstanceOf(PositionModel);
    expect(event.at.measure).toEqual(0);
    expect(event.at.beat).toEqual(0);
    expect(event.at.subdivision).toEqual(0);
    expect(event.type).toEqual('phrase');
    expect(event.value).toMatch(/^bass-[A-Z_a-z0-9]{8}/);
  })
});