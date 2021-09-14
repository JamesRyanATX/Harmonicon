import { 
  DottedQuarterUnit,
  DoubleDottedQuarterUnit,
  QuarterUnit,
  QuintupletQuarterUnit,
  SeptupletQuarterUnit,
  TripletQuarterUnit,
} from '../../src/units/quarter';

import { testUnit } from './_helper';

testUnit(QuarterUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 4],
    name: "quarter",
    names: [ "quarter", "crotchet" ], 
    shorthand: "q", 
    value: 0.25
  },
  toDecimal: 0.25,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 1 },
    { timeSignature: [ 6, 8 ], expectedValue: 2 }
  ],
});

testUnit(DottedQuarterUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 8 ],
    name: "quarter.",
    names: [ "quarter", "crotchet" ], 
    shorthand: "q", 
    value: 0.375
  },
  toDecimal: 0.375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 1.5 },
    { timeSignature: [ 6, 8 ], expectedValue: 3 }
  ]
});

testUnit(DoubleDottedQuarterUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 16 ],
    name: "quarter..",
    names: [ "quarter", "crotchet" ], 
    shorthand: "q", 
    value: 0.4375
  },
  toDecimal: 0.4375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 1.75 },
    { timeSignature: [ 6, 8 ], expectedValue: 3.5 }
  ]
});

testUnit(TripletQuarterUnit, {
  definition: {
    dots: 0,
    tuplet: 3,
    fraction: [ 1, 3 ],
    name: "triplet-quarter",
    names: [ "triplet-quarter" ], 
    shorthand: "tq", 
    value: 0.33333333333333333
  },
  toDecimal: 0.33333333333333333,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 1.3333333333333333 },
    { timeSignature: [ 5, 4 ], expectedValue: 1.3333333333333333 },
  ]
});

testUnit(QuintupletQuarterUnit, {
  definition: {
    dots: 0,
    tuplet: 5,
    fraction: [ 1, 5 ],
    name: "quintuplet-quarter",
    names: [ "quintuplet-quarter" ], 
    shorthand: "qq", 
    value: 0.2
  },
  toDecimal: 0.2,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.8 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.8 },
  ]
});

testUnit(SeptupletQuarterUnit, {
  definition: {
    dots: 0,
    tuplet: 7,
    fraction: [ 1, 7 ],
    name: "septuplet-quarter",
    names: [ "septuplet-quarter" ], 
    shorthand: "sq", 
    value: 0.14285714285714285,
  },
  toDecimal: 0.14285714285714285,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.5714285714285714 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.5714285714285714 },
  ]
});