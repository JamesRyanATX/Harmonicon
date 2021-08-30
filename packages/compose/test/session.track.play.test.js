import { PositionModel, QuarterUnit } from '@composer/core';
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

  describe('.note()', function () {
    it('sequences single notes', async function () {
      const { track } = await testTrack(({ track }) => {
        track.at(0, 0, 0).play(quarter.note(0));
      });

      expect(track.model.events.length).toEqual(1);
    });
  });

  describe('.phrase()', function () {

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
      expect(event.value).toMatch(/^bass-[A-Z_a-z0-9\-]{8}/);
    });

    it('sequences multiple pitches in one phrase step', async () => {
      const results = await testTrack(({ track }) => {
        track.at(0, 0, 0).play.phrase([
          quarter.note([ 0, 2, 3 ]),
          quarter.note(1),
          quarter.note(2),
          quarter.note(3),
        ]);
      });

      const session = results.session.model;
      const track = results.track.model;
      const event = track.events.first();
      const phrase = session.phrases.filterByProperty('name', event.value)[0];
      const steps = phrase.steps;

      expect(steps.length).toEqual(4);
      expect(steps[0].length).toEqual(3);

      expect(steps[0][0].duration).toEqual(QuarterUnit);
      expect(steps[0][0].octave).toEqual(null);
      expect(steps[0][0].pitch).toEqual(0);

      expect(steps[0][1].duration).toEqual(QuarterUnit);
      expect(steps[0][1].octave).toEqual(null);
      expect(steps[0][1].pitch).toEqual(2);

      expect(steps[0][2].duration).toEqual(QuarterUnit);
      expect(steps[0][2].octave).toEqual(null);
      expect(steps[0][2].pitch).toEqual(3);

      expect(steps[1].duration).toEqual(QuarterUnit);
      expect(steps[1].octave).toEqual(null);
      expect(steps[1].pitch).toEqual(1);

      expect(steps[2].duration).toEqual(QuarterUnit);
      expect(steps[2].octave).toEqual(null);
      expect(steps[2].pitch).toEqual(2);

      expect(steps[3].duration).toEqual(QuarterUnit);
      expect(steps[3].octave).toEqual(null);
      expect(steps[3].pitch).toEqual(3);
    });

    it('sequences rests in a phrase step', async () => {
      const results = await testTrack(({ track }) => {
        track.at(0, 0, 0).play.phrase([
          quarter.rest()
        ]);
      });

      const session = results.session.model;
      const track = results.track.model;
      const event = track.events.first();
      const phrase = session.phrases.filterByProperty('name', event.value)[0];
      const steps = phrase.steps;

      expect(steps[0].duration).toEqual(QuarterUnit);
      expect(steps[0].pitch).toEqual(undefined);
    });

  });
});