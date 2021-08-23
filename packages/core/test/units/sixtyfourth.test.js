import { SixtyfourthUnit as Unit } from '../../src/units/sixtyfourth';
import { testUnit } from './_helper';

testUnit(Unit, {
  definition: {
    dots: "",
    empty: false, 
    fraction: [1, 64],
    name: "sixty-fourth",
    names: [ "sixty-fourth", "hemidemisemiquaver" ], 
    shorthand: "sf", 
    value: 0.015625
  },
  toDecimal: 0.015625,
  toBeats: [
    { timeSignature: [ 4, 4 ], expectedValue: 0.0625, },
    { timeSignature: [ 6, 8 ], expectedValue: 0.125 }
  ]
});
