import { ThirtysecondUnit as Unit } from '../../src/units/thirtysecond';
import { testUnit } from './_helper';

testUnit(Unit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 32],
    name: "thirty-second",
    names: [ "thirty-second", "demisemiquaver" ], 
    shorthand: "t", 
    value: 0.03125
  },
  toDecimal: 0.03125,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.125, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.25 }
  ]
});
