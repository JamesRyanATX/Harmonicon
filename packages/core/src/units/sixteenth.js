import { BaseUnit } from './base.js';

export class SixteenthUnit extends BaseUnit {
  static name = 'sixteenth';
}

export class DottedSixteenthUnit extends BaseUnit {
  static name = 'sixteenth.';
}

export class DoubleDottedSixteenthUnit extends BaseUnit {
  static name = 'sixteenth..';
}

export class TripletSixteenthUnit extends BaseUnit {
  static definition = {
    dots: '',
    tuplet: 3,
    fraction: [ 1, 24 ],
    name: "triplet-sixteenth",
    names: [ "triplet-sixteenth" ], 
    shorthand: "ts",
    value: 1 / 24,
  }
}

export class QuintupletSixteenthUnit extends BaseUnit {
  static definition = {
    dots: '',
    tuplet: 5,
    fraction: [ 1, 20 ],
    name: "quintuplet-sixteenth",
    names: [ "quintuplet-sixteenth" ], 
    shorthand: "qs", 
    value: 0.05,
  }
}

export class SeptupletSixteenthUnit extends BaseUnit {
  static definition = {
    dots: '',
    tuplet: 7,
    fraction: [ 1, 28 ],
    name: "septuplet-sixteenth",
    names: [ "septuplet-sixteenth" ], 
    shorthand: "ss", 
    value: 1 / 28,
  }
}