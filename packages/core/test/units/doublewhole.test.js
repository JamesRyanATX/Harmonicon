import { DoubleWholeUnit, DottedDoubleWholeUnit, DoubleDottedDoubleWholeUnit } from '../../src/units/doublewhole';
import { testUnit } from './_helper';

testUnit(DoubleWholeUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [2, 1],
    name: "double whole",
    names: [ "double whole", "double", "breve" ], 
    shorthand: "d", 
    value: 2
  },
  toDecimal: 2,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 8 },
    { timeSignature: [ 6, 8 ], expectedValue: 16 }
  ],
  toMBS: [
    { timeSignature: [ 4, 4 ], expectedValue: '2:0:0' },
    { timeSignature: [ 6, 8 ], expectedValue: '2:4:0' }
  ]
});

testUnit(DottedDoubleWholeUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 1 ],
    name: "double whole.",
    names: [ "double whole", "double", "breve" ], 
    shorthand: "d", 
    value: 3
  },
  toDecimal: 3,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 12 },
    { timeSignature: [ 6, 8 ], expectedValue: 24 }
  ],
  toMBS: [
    { timeSignature: [ 4, 4 ], expectedValue: '3:0:0' },
    { timeSignature: [ 6, 8 ], expectedValue: '4:0:0' }
  ]
});

testUnit(DoubleDottedDoubleWholeUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 2 ],
    name: "double whole..",
    names: [ "double whole", "double", "breve" ], 
    shorthand: "d", 
    value: 3.5
  },
  toDecimal: 3.5,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 14 },
    { timeSignature: [ 6, 8 ], expectedValue: 28 }
  ],
  toMBS: [
    { timeSignature: [ 4, 4 ], expectedValue: '3:2:0' },
    { timeSignature: [ 6, 8 ], expectedValue: '4:4:0' }
  ]
});