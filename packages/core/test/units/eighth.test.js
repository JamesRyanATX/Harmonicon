import { EighthUnit, DottedEighthUnit, DoubleDottedEighthUnit } from '../../src/units/eighth';
import { testUnit } from './_helper';

testUnit(EighthUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 8],
    name: "eighth",
    names: [ "eighth", "quaver" ], 
    shorthand: "e", 
    value: 0.125
  },
  toDecimal: 0.125,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.5 },
    { timeSignature: [ 6, 8 ], expectedValue: 1 }
  ]
});

testUnit(DottedEighthUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 16 ],
    name: "eighth.",
    names: [ "eighth", "quaver" ], 
    shorthand: "e", 
    value: 0.1875
  },
  toDecimal: 0.1875,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.75 },
    { timeSignature: [ 6, 8 ], expectedValue: 1.5 }
  ]
});

testUnit(DoubleDottedEighthUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 32 ],
    name: "eighth..",
    names: [ "eighth", "quaver" ], 
    shorthand: "e", 
    value: 0.21875
  },
  toDecimal: 0.21875,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.875 },
    { timeSignature: [ 6, 8 ], expectedValue: 1.75 }
  ]
});