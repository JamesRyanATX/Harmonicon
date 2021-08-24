import { ThirtySecondUnit, DottedThirtySecondUnit, DoubleDottedThirtySecondUnit } from '../../src/units/thirtysecond';
import { testUnit } from './_helper';

testUnit(ThirtySecondUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 32],
    name: "thirty-second",
    names: [ "thirty-second", "demisemiquaver" ], 
    shorthand: "t", 
    value: 0.03125
  },
  toDecimal: 0.03125,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.125, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.25 }
  ]
});

testUnit(DottedThirtySecondUnit, {
  definition: {
    dots: ".",
    empty: false, 
    fraction: [3, 64],
    name: "thirty-second.",
    names: [ "thirty-second", "demisemiquaver" ], 
    shorthand: "t", 
    value: 0.046875
  },
  toDecimal: 0.046875,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.1875, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.375 }
  ]
});

testUnit(DoubleDottedThirtySecondUnit, {
  definition: {
    dots: "..",
    empty: false, 
    fraction: [7, 128],
    name: "thirty-second..",
    names: [ "thirty-second", "demisemiquaver" ], 
    shorthand: "t", 
    value: 0.0546875
  },
  toDecimal: 0.0546875,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.21875, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.4375 }
  ]
});