import { SixtyFourthUnit, DottedSixtyFourthUnit, DoubleDottedSixtyFourthUnit } from '../../src/units/sixtyfourth';
import { testUnit } from './_helper';

testUnit(SixtyFourthUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 64],
    name: "sixty-fourth",
    names: [ "sixty-fourth", "hemidemisemiquaver" ], 
    shorthand: "sf", 
    value: 0.015625
  },
  toDecimal: 0.015625,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.0625, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.125 }
  ]
});

testUnit(DottedSixtyFourthUnit, {
  definition: {
    dots: ".",
    empty: false, 
    fraction: [3, 128],
    name: "sixty-fourth.",
    names: [ "sixty-fourth", "hemidemisemiquaver" ], 
    shorthand: "sf", 
    value: 0.0234375
  },
  toDecimal: 0.0234375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.09375, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.1875 }
  ]
});

testUnit(DoubleDottedSixtyFourthUnit, {
  definition: {
    dots: "..",
    empty: false, 
    fraction: [7, 256],
    name: "sixty-fourth..",
    names: [ "sixty-fourth", "hemidemisemiquaver" ], 
    shorthand: "sf", 
    value: 0.02734375
  },
  toDecimal: 0.02734375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.109375, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.21875 }
  ]
});
