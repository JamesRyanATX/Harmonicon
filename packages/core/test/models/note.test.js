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

  describe('#pitch', function () {
    it('must be a valid pitch', function () {
      expect(NoteModel.parse({ pitch: 'c4' }).pitch).toEqual('C4');
      expect(NoteModel.parse({ pitch: 0 }).pitch).toEqual(0);
      expect(NoteModel.parse({ pitch: -10 }).pitch).toEqual(-10);

      expect(() => {
        NoteModel.parse({
          pitch: 'apples',
        })
      }).toThrow(`pitch must be in ABC notation or an integer`);
    });
  });

  describe('#velocity', function () {
    it('must be a number', function () {
      expect(() => {
        NoteModel.parse({
          pitch: 'c4',
          velocity: '2'
        })
      }).toThrow(`velocity must be a kind of Number`);
    })

    it('must be between 0 and 1', function () {
      expect(() => {
        NoteModel.parse({
          pitch: 'c4',
          velocity: 2
        })
      }).toThrow(`velocity must be between 0 and 1`);
    })

    it('defaults to 1', function () {
      expect(NoteModel.parse({
        pitch: 'c4',
      }).velocity).toEqual(1);
    });
  });

});