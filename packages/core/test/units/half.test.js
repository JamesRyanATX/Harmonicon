import { HalfUnit, DottedHalfUnit, DoubleDottedHalfUnit } from '../../src/units/half';
import { testUnit } from './_helper';

testUnit(HalfUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 2],
    name: "half",
    names: [ "half", "minim" ], 
    shorthand: "h", 
    value: 0.5
  },
  toDecimal: 0.5,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 2, },
    { timeSignature: [ 6, 8 ], expectedValue: 4 }
  ]
});

testUnit(DottedHalfUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 4 ],
    name: "half.",
    names: [ "half", "minim" ], 
    shorthand: "h", 
    value: 0.75
  },
  toDecimal: 0.75,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 3 },
    { timeSignature: [ 6, 8 ], expectedValue: 6 }
  ]
});

testUnit(DoubleDottedHalfUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 8 ],
    name: "half..",
    names: [ "half", "minim" ], 
    shorthand: "h", 
    value: 0.875
  },
  toDecimal: 0.875,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 3.5 },
    { timeSignature: [ 6, 8 ], expectedValue: 7 }
  ]
});