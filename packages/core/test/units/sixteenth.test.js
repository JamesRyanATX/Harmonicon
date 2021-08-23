import { SixteenthUnit, DottedSixteenthUnit, DoubleDottedSixteenthUnit } from '../../src/units/sixteenth';
import { testUnit } from './_helper';

testUnit(SixteenthUnit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 16],
    name: "sixteenth",
    names: [ "sixteenth", "semiquaver" ], 
    shorthand: "s", 
    value: 0.0625
  },
  toDecimal: 0.0625,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.25, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.5 }
  ],
});

testUnit(DottedSixteenthUnit, {
  definition: {
    dots: '.',
    empty: false, 
    fraction: [ 3, 32 ],
    name: "sixteenth.",
    names: [ "sixteenth", "semiquaver" ], 
    shorthand: "s", 
    value: 0.09375
  },
  toDecimal: 0.09375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.375 },
    { timeSignature: [ 6, 8 ], expectedValue: 0.75 }
  ]
});

testUnit(DoubleDottedSixteenthUnit, {
  definition: {
    dots: '..',
    empty: false, 
    fraction: [ 7, 64 ],
    name: "sixteenth..",
    names: [ "sixteenth", "semiquaver" ], 
    shorthand: "s", 
    value: 0.109375
  },
  toDecimal: 0.109375,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.4375 },
    { timeSignature: [ 6, 8 ], expectedValue: 0.875 }
  ]
});