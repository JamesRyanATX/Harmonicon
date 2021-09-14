import { 
  EighthUnit,
  DottedEighthUnit,
  DoubleDottedEighthUnit,
  TripletEighthUnit,
  QuintupletEighthUnit,
  SeptupletEighthUnit
} from '../../src/units/eighth';

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

testUnit(TripletEighthUnit, {
  definition: {
    dots: 0,
    tuplet: 3,
    fraction: [ 1, 12 ],
    name: "triplet-eighth",
    names: [ "triplet-eighth" ], 
    shorthand: "te", 
    value: 0.08333333333333333
  },
  toDecimal: 0.08333333333333333,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.3333333333333333 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.3333333333333333 },
  ]
});

testUnit(QuintupletEighthUnit, {
  definition: {
    dots: 0,
    tuplet: 5,
    fraction: [ 1, 10 ],
    name: "quintuplet-eighth",
    names: [ "quintuplet-eighth" ], 
    shorthand: "qe", 
    value: 0.1
  },
  toDecimal: 0.1,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.4 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.4 },
  ]
});

testUnit(SeptupletEighthUnit, {
  definition: {
    dots: 0,
    tuplet: 7,
    fraction: [ 1, 14 ],
    name: "septuplet-eighth",
    names: [ "septuplet-eighth" ], 
    shorthand: "se", 
    value: 0.07142857142857142,
  },
  toDecimal: 0.07142857142857142,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.2857142857142857 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.2857142857142857 },
  ]
});