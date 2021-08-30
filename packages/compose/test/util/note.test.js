import { quarter} from '../../src/util/note';
import { ChordType } from '@tonaljs/tonal';


function describeUnitComposer(unit) {
  describe(unit.duration.name, function () {
    [

      // Absolute pitches
      // ----------------

      {
        input: [ 'a' ],
        output: { pitch: 'A3', octave: 3, pitchType: 'absolute' },
      },
      {
        input: [ 'ab' ],
        output: { pitch: 'Ab4', octave: 4, pitchType: 'absolute' },
      },
      {
        input: [ 'c' ],
        output: { pitch: 'C4', octave: 4, pitchType: 'absolute' },
      },
      {
        input: [ 'c4' ],
        output: { pitch: 'C4', octave: 4, pitchType: 'absolute' },
      },
      {
        input: [ 'a0' ],
        output: { pitch: 'A0', octave: 0, pitchType: 'absolute' },
      },
      {
        input: [ 'ab5' ],
        output: { pitch: 'Ab5', octave: 5, pitchType: 'absolute' },
      },
      {
        input: [ 'd#5' ],
        output: { pitch: 'D#5', octave: 5, pitchType: 'absolute' },
      },


      // Relative pitches
      // ----------------

      {
        input: [ 0 ],
        output: { pitch: 0, octave: null, pitchType: 'relative' },
      },
      {
        input: [ -21 ],
        output: { pitch: -21, octave: null, pitchType: 'relative' },
      },
      {
        input: [ 21 ],
        output: { pitch: 21, octave: null, pitchType: 'relative' },
      },


      // Chords without pitch in symbol
      // ------------------------------

      {
        input: [ 'maj7', { pitch: 'c5' } ],
        output: [
          { pitch: 'C5', octave: 5, pitchType: 'absolute' },
          { pitch: 'E5', octave: 5, pitchType: 'absolute' },
          { pitch: 'G5', octave: 5, pitchType: 'absolute' },
          { pitch: 'B5', octave: 5, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'maj7', { pitch: 'c', octave: 2 } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
          { pitch: 'B2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'maj7', { tonic: 'c2' } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
          { pitch: 'B2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'maj7', { root: 'c2' } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
          { pitch: 'B2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'maj7', { root: 'c2', tonic: 'c2' } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
          { pitch: 'B2', octave: 2, pitchType: 'absolute' },
        ]
      },

      // more permutations of above ^^^^

      {
        input: [ 'C4maj7' ],
        output: [
          { pitch: 'C4', octave: 4, pitchType: 'absolute' },
          { pitch: 'E4', octave: 4, pitchType: 'absolute' },
          { pitch: 'G4', octave: 4, pitchType: 'absolute' },
          { pitch: 'B4', octave: 4, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'Cmaj7' ],
        output: [
          { pitch: 'C4', octave: 4, pitchType: 'absolute' },
          { pitch: 'E4', octave: 4, pitchType: 'absolute' },
          { pitch: 'G4', octave: 4, pitchType: 'absolute' },
          { pitch: 'B3', octave: 3, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'Cmaj7', { octave: 2 } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
          { pitch: 'B2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'C7b9' ],
        output: [
          { pitch: 'C4', octave: 4, pitchType: 'absolute' },
          { pitch: 'E4', octave: 4, pitchType: 'absolute' },
          { pitch: 'G4', octave: 4, pitchType: 'absolute' },
          { pitch: 'Bb3', octave: 3, pitchType: 'absolute' },
          { pitch: 'Db4', octave: 4, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'C7b9', { octave: 5 } ],
        output: [
          { pitch: 'C5', octave: 5, pitchType: 'absolute' },
          { pitch: 'E5', octave: 5, pitchType: 'absolute' },
          { pitch: 'G5', octave: 5, pitchType: 'absolute' },
          { pitch: 'Bb5', octave: 5, pitchType: 'absolute' },
          { pitch: 'Db5', octave: 5, pitchType: 'absolute' },
        ]
      },

      {
        input: [ 'c e g' ],
        output: [
          { pitch: 'C4', octave: 4, pitchType: 'absolute' },
          { pitch: 'E4', octave: 4, pitchType: 'absolute' },
          { pitch: 'G4', octave: 4, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'c e g', { octave: 2 } ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ [ 'c', 'e', 'g' ], { octave: 6 } ],
        output: [
          { pitch: 'C6', octave: 6, pitchType: 'absolute' },
          { pitch: 'E6', octave: 6, pitchType: 'absolute' },
          { pitch: 'G6', octave: 6, pitchType: 'absolute' },
        ]
      },

      {
        input: [ 'c4 e4 g4' ],
        output: [
          { pitch: 'C4', octave: 4, pitchType: 'absolute' },
          { pitch: 'E4', octave: 4, pitchType: 'absolute' },
          { pitch: 'G4', octave: 4, pitchType: 'absolute' },
        ]
      },
      {
        input: [ 'c2 e2 g2' ],
        output: [
          { pitch: 'C2', octave: 2, pitchType: 'absolute' },
          { pitch: 'E2', octave: 2, pitchType: 'absolute' },
          { pitch: 'G2', octave: 2, pitchType: 'absolute' },
        ]
      },
      {
        input: [ [ 'c6', 'e6', 'g6' ] ],
        output: [
          { pitch: 'C6', octave: 6, pitchType: 'absolute' },
          { pitch: 'E6', octave: 6, pitchType: 'absolute' },
          { pitch: 'G6', octave: 6, pitchType: 'absolute' },
        ]
      },

    ].forEach((scenario) => {
      describeUnitComposerScenario(unit, scenario);
    });
  });
}

function describeUnitComposerScenario(unit, { input, output }) {
  describe(`${unit.duration.name}.note(${input})`, function () {
    const results = unit.note.apply(this, input);
    
    // Polyphonic notes (i.e. chords)
    if (Array.isArray(output)) {
      it('is polyphonic', function () {
        expect(results).toEqual(expect.any(Array))
      });

      it('returns the correct number of notes', function () {
        expect(results.length).toEqual(output.length);
      });

      output.forEach((expected, i) => {
        describe(`note ${i}`, function () {
          testNote(unit, results[i], expected);
        });
      });

      it('returns the correct number of notes', function () {
        expect(results.length).toEqual(output.length);
      });
    }

    // Monophonic notes
    else {
      testNote(unit, results, output);
    }
  });
}

function testNote(unit, actual, expected) {
  expected.duration = unit.duration;

  Object.entries(expected).forEach(([ property, value ]) => {
    it(`sets ${property} to ${value}`, function () {
      expect(actual[property]).toEqual(value);
    });
  });
}

describe('util/note', function () {
  [
    quarter
  ].forEach(describeUnitComposer);
});