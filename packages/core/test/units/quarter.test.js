import { QuarterUnit, DottedQuarterUnit, DoubleDottedQuarterUnit } from '../../src/units/quarter';
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