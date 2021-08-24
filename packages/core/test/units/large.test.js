import { LargeUnit, DottedLargeUnit, DoubleDottedLargeUnit } from '../../src/units/large';
import { testUnit } from './_helper';

testUnit(LargeUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [8, 1],
    name: "large",
    names: [ "large", "duplex longa", "maxima", "octuple", "octuple whole" ], 
    shorthand: "dl", 
    value: 8
  },
  toDecimal: 8,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 32 },
    { timeSignature: [ 6, 8 ], expectedValue: 64 }
  ]
});

testUnit(DottedLargeUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 12, 1 ],
    name: "large.",
    names: [ "large", "duplex longa", "maxima", "octuple", "octuple whole" ], 
    shorthand: "dl", 
    value: 12
  },
  toDecimal: 12,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 48 },
    { timeSignature: [ 6, 8 ], expectedValue: 96 }
  ]
});

testUnit(DoubleDottedLargeUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 14, 1 ],
    name: "large..",
    names: [ "large", "duplex longa", "maxima", "octuple", "octuple whole" ], 
    shorthand: "dl", 
    value: 14
  },
  toDecimal: 14,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 56 },
    { timeSignature: [ 6, 8 ], expectedValue: 112 }
  ]
});