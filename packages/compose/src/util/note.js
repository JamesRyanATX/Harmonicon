import {
  NoteModel,
  RestModel,
  EighthUnit,
  HalfUnit,
  QuarterUnit,
  SixteenthUnit,
  SixtyfourthUnit,
  WholeUnit,
  ThirtysecondUnit
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

export const whole = composerFor(WholeUnit);
export const half = composerFor(HalfUnit);
export const quarter = composerFor(QuarterUnit);
export const eighth = composerFor(EighthUnit);
export const sixteenth = composerFor(SixteenthUnit);
export const thirtysecond = composerFor(ThirtysecondUnit);
export const sixtyfourth = composerFor(SixtyfourthUnit);
