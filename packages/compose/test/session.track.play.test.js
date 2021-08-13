import { PositionModel, QuarterUnit, RendererModel } from '@composer/core';
import { MockDriver } from '@composer/driver-mock';
import { quarter, session, phrase } from '../';

async function testTrack(fn) {
  const results = {};

  await session('my-song', async function ({ session }) {
    session.instrument('bass', async function () {
      return 'i am instrument';
    });

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

  it('sequences phrases notes', async function () {
    const { track } = await testTrack(({ track }) => {
      track.at(0, 0, 0).play(phrase(
        quarter.note(0),
        quarter.note(1),
        quarter.note(2),
        quarter.note(3),
      ));
    });

    expect(track.model.events.length).toEqual(1);

    const event = track.model.events.first();

    expect(event.at).toBeInstanceOf(PositionModel);
    expect(event.at.measure).toEqual(0);
    expect(event.at.beat).toEqual(0);
    expect(event.at.subdivision).toEqual(0);

    expect(event.type).toEqual('phrase');
    expect(event.value.length).toEqual(4);

    expect(event.value[0].pitch).toEqual(0);
    expect(event.value[0].duration).toEqual(QuarterUnit);
    expect(event.value[1].pitch).toEqual(1);
    expect(event.value[1].duration).toEqual(QuarterUnit);
    expect(event.value[2].pitch).toEqual(2);
    expect(event.value[2].duration).toEqual(QuarterUnit);
    expect(event.value[3].pitch).toEqual(3);
    expect(event.value[3].duration).toEqual(QuarterUnit);
  });

  it.only('renders a session', async function () {
    const { session } = await testTrack(({ track }) => {
      track.at(0, 0, 0).play(phrase(
        quarter.note(0),
        quarter.note(1),
        quarter.note(2),
        quarter.note(3),
      ));
    });

    const renderer = await session.render(MockDriver);

    expect(renderer).toBeInstanceOf(RendererModel);
    expect(renderer.driver).toBeInstanceOf(MockDriver);
    expect(renderer.session).toEqual(session.model);
  });
});