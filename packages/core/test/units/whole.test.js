import { WholeUnit, DottedWholeUnit, DoubleDottedWholeUnit } from '../../src/units/whole';
import { testUnit } from './_helper';

testUnit(WholeUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 1],
    name: "whole",
    names: [ "whole", "semibreve" ], 
    shorthand: "w", 
    value: 1
  },
  toDecimal: 1,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 4 },
    { timeSignature: [ 6, 8 ], expectedValue: 8 }
  ]
});

testUnit(DottedWholeUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 2 ],
    name: "whole.",
    names: [ "whole", "semibreve" ], 
    shorthand: "w", 
    value: 1.5
  },
  toDecimal: 1.5,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 6 },
    { timeSignature: [ 6, 8 ], expectedValue: 12 }
  ]
});

testUnit(DoubleDottedWholeUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 4 ],
    name: "whole..",
    names: [ "whole", "semibreve" ], 
    shorthand: "w", 
    value: 1.75
  },
  toDecimal: 1.75,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 7 },
    { timeSignature: [ 6, 8 ], expectedValue: 14 }
  ]
});