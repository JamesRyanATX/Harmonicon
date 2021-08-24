import { LongUnit, DottedLongUnit, DoubleDottedLongUnit } from '../../src/units/long';
import { testUnit } from './_helper';

testUnit(LongUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [4, 1],
    name: "long",
    names: [ "long", "longa" ], 
    shorthand: "l", 
    value: 4
  },
  toDecimal: 4,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 16 },
    { timeSignature: [ 6, 8 ], expectedValue: 32 }
  ]
});

testUnit(DottedLongUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 6, 1 ],
    name: "long.",
    names: [ "long", "longa" ], 
    shorthand: "l", 
    value: 6
  },
  toDecimal: 6,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 24 },
    { timeSignature: [ 6, 8 ], expectedValue: 48 }
  ]
});

testUnit(DoubleDottedLongUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 1 ],
    name: "long..",
    names: [ "long", "longa" ], 
    shorthand: "l", 
    value: 7
  },
  toDecimal: 7,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 28 },
    { timeSignature: [ 6, 8 ], expectedValue: 56 }
  ]
});