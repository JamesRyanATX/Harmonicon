import { NoteComposer } from '../src/note';
import { NoteModel, ChordModel, QuarterUnit, KeySignatureModel } from '@composer/core';
import { ComposerError } from '../src/errors';

class composer extends NoteComposer {
  static unit = QuarterUnit;
}

describe('NoteComposer', function () {
  const octaves = [
    1,
    2,
    3,
    4,
    5,
    6
  ];

  const absoluteNotes = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
  ]

  const relativeNotes = [
    -7,
    -6,
    -5,
    -4,
    -3,
    -2,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ];

  const keySignatures = [
    KeySignatureModel.parse({
      tonic: 'c3',
      mode: 'major'
    }),
    KeySignatureModel.parse({
      tonic: 'c1',
      mode: 'minor'
    })
  ]

  describe('chords', function () {
    const only = [
    //  'C69#11',
    //  'C5'
    ];

    const skip = [
      'A69#11',
      'B69#11',
      'Cb69#11',
      'C69#11',
      'C#69#11',
      'D69#11',
      'E69#11',
      'F69#11',
      'G69#11',
    ];

    const keys = [
      { root: 'a', tonic: 'a' },
      { root: 'b', tonic: 'b' },
      { root: 'cb', tonic: 'cb' },
      { root: 'c', tonic: 'c' },
      { root: 'c#', tonic: 'c#' },
      { root: 'd', tonic: 'd' },
      { root: 'e', tonic: 'e' },
      { root: 'f', tonic: 'f' },
    ];

    const testChords = keys.map((rt) => {
      rt.chords = ChordModel.chordsFor({ 
        root: rt.root, 
        tonic: rt.tonic
      })
        .filter((chord) => {
          if (only.length > 0) {
            return only.indexOf(chord.symbol) > -1;
          }
          else {
            return skip.indexOf(chord.symbol) === -1;
          }
        });

      return rt;
    });

    function forEachTestChord(fn) {
      testChords.forEach(({ root, tonic, chords }) => {
        chords.forEach((chord) => {
          fn({ root, tonic, chord });
        });
      });
    }

    describe('absolute', function () {
      forEachTestChord(({ root, tonic, chord }) => {
        it(`parses ${chord.symbol} (root ${root}, tonic ${tonic})`, async function () {

          function test(fn) {
            try {
              fn();
            }
            catch (e) {
              if (!e instanceof ComposerError) {
                throw e;
              }
            }
          }

          const implicit = composer.note(chord.symbol);
          const explicit = composer.note(`*${chord.symbol}`);

          if (implicit instanceof NoteModel) {
            expect(explicit.length).toEqual(chord.notes.length);
          }
          else {
            expect(implicit.length).toEqual(chord.notes.length);
          }
        });  
      });
    });

    describe('relative', function () {
      it.todo('is unsupported');
    });
  });

  describe('notes', function () {
    function testNote(note, fn) {
      it(`parses ${note}`, async function () {
        const result = composer.note(note);

        expect(result.constructor).toEqual(NoteModel);
        expect(result.duration).toEqual(QuarterUnit);

        if (fn) {
          fn(result);
        };
      });
    }

    describe('absolute', function () {
      absoluteNotes.forEach((note) => {
        testNote(note);
        testNote(`${note}b`);
        testNote(`${note}#`);

        octaves.forEach((octave) => {
          testNote(`${note}${octave}`);
          testNote(`${note}b${octave}`);
          testNote(`${note}#${octave}`);
        });
      });
    });

    describe('relative', function () {
      relativeNotes.forEach((note) => {
        testNote(note, (note) => {
          keySignatures.forEach((keySignature) => {
            expect(note.computedPitch(keySignature)).toBeTruthy();
          });  
        });
      });
    });
  });

});