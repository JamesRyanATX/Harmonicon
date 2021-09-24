import { NoteModel } from '../../';

describe('NoteModel', function () {

  describe('.parseAbsolutePitch', function () {
    describe('note aliases', function () {
      describe('without octave', function () {
        it('parses', function () {
          expect(NoteModel.parseAbsolutePitch({
            pitch: 'snare',
            octave: 2
          })).toEqual({ pitch: 'snare', octave: 2 });
        });
      });
    });

    describe('abc notes', function () {
      describe('without octave', function () {
        it('parses', function () {
          expect(NoteModel.parseAbsolutePitch({
            pitch: 'a',
          })).toEqual({ pitch: 'A3', octave: 3 });

          expect(NoteModel.parseAbsolutePitch({
            pitch: 'Bb',
          })).toEqual({ pitch: 'Bb3', octave: 3 });

          expect(NoteModel.parseAbsolutePitch({
            pitch: 'c',
          })).toEqual({ pitch: 'C4', octave: 4 });

          expect(NoteModel.parseAbsolutePitch({
            pitch: 'c#',
          })).toEqual({ pitch: 'C#4', octave: 4 });
        });
      });

      describe('with octave', function () {
        it('parses', function () {
          expect(NoteModel.parseAbsolutePitch({
            pitch: 'c',
            octave: 2
          })).toEqual({ pitch: 'C2', octave: 2 });

          expect(NoteModel.parseAbsolutePitch({
            pitch: 'c5',
            octave: 2
          })).toEqual({ pitch: 'C5', octave: 5 });
        });
      });
    });
  });

})