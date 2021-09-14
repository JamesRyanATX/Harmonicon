import {
  DottedSixteenthUnit,
  DoubleDottedSixteenthUnit,
  QuintupletSixteenthUnit,
  SeptupletSixteenthUnit,
  SixteenthUnit,
  TripletSixteenthUnit,
} from '../../src/units/sixteenth';
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


testUnit(TripletSixteenthUnit, {
  definition: {
    dots: '',
    tuplet: 3,
    fraction: [ 1, 24 ],
    name: "triplet-sixteenth",
    names: [ "triplet-sixteenth" ], 
    shorthand: "ts", 
    value: 0.041666666666666664
  },
  toDecimal: 0.041666666666666664,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.16666666666666666 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.16666666666666666 },
  ]
});

testUnit(QuintupletSixteenthUnit, {
  definition: {
    dots: '',
    tuplet: 5,
    fraction: [ 1, 20 ],
    name: "quintuplet-sixteenth",
    names: [ "quintuplet-sixteenth" ], 
    shorthand: "qs", 
    value: 0.05
  },
  toDecimal: 0.05,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.2 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.2 },
  ]
});

testUnit(SeptupletSixteenthUnit, {
  definition: {
    dots: '',
    tuplet: 7,
    fraction: [ 1, 28 ],
    name: "septuplet-sixteenth",
    names: [ "septuplet-sixteenth" ], 
    shorthand: "ss", 
    value: 0.03571428571428571,
  },
  toDecimal: 0.03571428571428571,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.14285714285714285 },
    { timeSignature: [ 5, 4 ], expectedValue: 0.14285714285714285 },
  ]
});