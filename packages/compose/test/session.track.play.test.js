import { PositionModel, QuarterUnit } from '@composer/core';
import { quarter, session } from '../';

function testTrack(fn) {
  const results = {};

  session('my-song', function ({ session }) {
    session.at(0).annotate('verse');
    session.at(10).annotate('chorus');

    session.instrument('bass', function () {
      return 'i am instrument';
    });

    session.phrase('a-phrase', ({ phrase }) => {
      phrase.sequence(
        quarter.note(0),
        quarter.note(1),
        quarter.note(2),
        quarter.note(3),
      );
    })

    session.track('bass', ({ track }) => {
      results.track = track;
      results.session = session;

      return fn({ track });
    });
  });

  return results;
}

describe('session.track.play', function () {

  describe('.note()', function () {
    it('can be called via annotation', function () {
      const { track } = testTrack(({ track }) => {
        track.at('chorus').play(quarter.note(0));
      });

      const events = track.model.events;
      const event = events.first();

      expect(event.at.measure).toEqual(10);
      expect(event.at.beat).toEqual(0);
      expect(event.at.subdivision).toEqual(0);
    });

    it('sequences single notes', function () {
      const { track } = testTrack(({ track }) => {
        track.at(0, 0, 0).play(quarter.note(0));
      });

      expect(track.model.events.length).toEqual(1);
    });
  });

  describe('.phrase()', function () {

    it('sequences phrases by name', function () {
      const { track } = testTrack(({ track }) => {
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

    it('sequences anonymous phrases', function () {
      const { track } = testTrack(({ track }) => {
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

    it('sequences multiple pitches in one phrase step', () => {
      const results = testTrack(({ track }) => {
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
      const sequence = phrase.sequence.source;

      expect(sequence.length).toEqual(4);
      expect(sequence[0].length).toEqual(3);

      expect(sequence[0].source[0].duration).toEqual(QuarterUnit);
      expect(sequence[0].source[0].octave).toEqual(null);
      expect(sequence[0].source[0].pitch).toEqual(0);

      expect(sequence[0].source[1].duration).toEqual(QuarterUnit);
      expect(sequence[0].source[1].octave).toEqual(null);
      expect(sequence[0].source[1].pitch).toEqual(2);

      expect(sequence[0].source[2].duration).toEqual(QuarterUnit);
      expect(sequence[0].source[2].octave).toEqual(null);
      expect(sequence[0].source[2].pitch).toEqual(3);

      expect(sequence[1].duration).toEqual(QuarterUnit);
      expect(sequence[1].octave).toEqual(null);
      expect(sequence[1].pitch).toEqual(1);

      expect(sequence[2].duration).toEqual(QuarterUnit);
      expect(sequence[2].octave).toEqual(null);
      expect(sequence[2].pitch).toEqual(2);

      expect(sequence[3].duration).toEqual(QuarterUnit);
      expect(sequence[3].octave).toEqual(null);
      expect(sequence[3].pitch).toEqual(3);
    });

    it('sequences rests in a phrase step', () => {
      const results = testTrack(({ track }) => {
        track.at(0, 0, 0).play.phrase([
          quarter.rest()
        ]);
      });

      const session = results.session.model;
      const track = results.track.model;
      const event = track.events.first();
      const phrase = session.phrases.filterByProperty('name', event.value)[0];
      const sequence = phrase.sequence.source;

      expect(sequence[0].duration).toEqual(QuarterUnit);
      expect(sequence[0].pitch).toEqual(undefined);
    });

  });
});