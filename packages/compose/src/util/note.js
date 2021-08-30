import {
  ApplicationError,

  ChordModel,
  NoteModel,
  RestModel,

  DoubleDottedLargeUnit,
  DottedLargeUnit,
  LargeUnit,

  DoubleDottedLongUnit,
  DottedLongUnit,
  LongUnit,
  
  DoubleDottedDoubleWholeUnit,
  DottedDoubleWholeUnit,
  DoubleWholeUnit,

  DoubleDottedWholeUnit,
  DottedWholeUnit,
  WholeUnit,

  DoubleDottedHalfUnit,
  DottedHalfUnit,
  HalfUnit,

  DoubleDottedQuarterUnit,
  DottedQuarterUnit,
  QuarterUnit,

  DoubleDottedEighthUnit,
  DottedEighthUnit,
  EighthUnit,

  DoubleDottedSixteenthUnit,
  DottedSixteenthUnit,
  SixteenthUnit,

  DoubleDottedThirtySecondUnit,
  DottedThirtySecondUnit,
  ThirtySecondUnit,

  DoubleDottedSixtyFourthUnit,
  DottedSixtyFourthUnit,
  SixtyFourthUnit,

} from "@composer/core";
import { ComposerError } from "../errors";

function isNote (pitch) {
  return (
    typeof pitch === 'number' ||
    (
      typeof pitch === 'string' &&
      pitch.match(/^[abcdefg][b\#]{0,1}[0-9]{0,1}$/i)
    )
  );
}

function composerFor (duration) {
  return {
    duration,

    // note('c') => Note(C4)
    // note('c', { octave: 2 }) => Note(C2)
    // note('c4') => Note(C4)
    // note('cmaj7') => [ Note(C4), ...]
    // note('c5maj7') => [ Note(C5), ... ]
    // note('c0 f4') => [ Note(C0), Note(F4) ]
    // note(['c0', f4']) => [ Note(C0), Note(F4) ]
    note: (input, options) => {

      function single(pitch) {
        return NoteModel.parse(
          Object.assign({ duration, pitch }, options)
        );
      }

      function multiple(pitches) {
        return pitches.map((pitch) => {
          return NoteModel.parse(
            Object.assign({ duration, pitch }, options)
          );
        });
      }

      function chord(symbol) {
        return ChordModel.parse(
          Object.assign({ duration, symbol }, options)
        ).toNotes();
      }

      try {
        if (Array.isArray(input)) {
          return multiple(input);
        }
        else if (typeof input === 'string' && input.match(/ /)) {
          return multiple(input.split(/ +/));
        }
        else if (isNote(input)) {
          return single(input);
        }
        else {
          return chord(input);
        }
      }
      catch (e) {
        if (e instanceof ApplicationError) {
          throw new ComposerError(e.message);
        }
      }
    },

    rest: (options = {}) => {
      return RestModel.parse(Object.assign({ duration }, options));
    }
  }
}

export const doubleDottedLarge = composerFor(DoubleDottedLargeUnit);
export const dottedLarge = composerFor(DottedLargeUnit);
export const large = composerFor(LargeUnit);

export const doubleDottedLong = composerFor(DoubleDottedLongUnit);
export const dottedLong = composerFor(DottedLongUnit);
export const long = composerFor(LongUnit);

export const doubleDottedDoubleWhole = composerFor(DoubleDottedDoubleWholeUnit);
export const dottedDoubleWhole = composerFor(DottedDoubleWholeUnit);
export const doubleWhole = composerFor(DoubleWholeUnit);

export const doubleDottedWhole = composerFor(DoubleDottedWholeUnit);
export const dottedWhole = composerFor(DottedWholeUnit);
export const whole = composerFor(WholeUnit);

export const doubleDottedHalf = composerFor(DoubleDottedHalfUnit);
export const dottedHalf = composerFor(DottedHalfUnit);
export const half = composerFor(HalfUnit);

export const doubleDottedQuarter = composerFor(DoubleDottedQuarterUnit);
export const dottedQuarter = composerFor(DottedQuarterUnit);
export const quarter = composerFor(QuarterUnit);

export const doubleDottedEighth = composerFor(DoubleDottedEighthUnit);
export const dottedEighth = composerFor(DottedEighthUnit);
export const eighth = composerFor(EighthUnit);

export const doubleDottedSixteenth = composerFor(DoubleDottedSixteenthUnit);
export const dottedSixteenth = composerFor(DottedSixteenthUnit);
export const sixteenth = composerFor(SixteenthUnit);

export const doubleDottedThirtySecond = composerFor(DoubleDottedThirtySecondUnit);
export const dottedThirtySecond = composerFor(DottedThirtySecondUnit);
export const thirtySecond = composerFor(ThirtySecondUnit);

export const doubleDottedSixtyFourth = composerFor(DoubleDottedSixtyFourthUnit);
export const dottedSixtyFourth = composerFor(DottedSixtyFourthUnit);
export const sixtyFourth = composerFor(SixtyFourthUnit);
