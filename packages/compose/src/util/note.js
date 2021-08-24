import {
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

function composerFor (duration) {
  return {
    note: (pitch, options) => {
      return NoteModel.parse(Object.assign({ duration, pitch }, options));
    },
    rest: (options) => {
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
