import { BaseUnit } from './base.js';

export class EighthUnit extends BaseUnit {
  static name = 'eighth';
}

export class DottedEighthUnit extends BaseUnit {
  static name = 'eighth.';
}

export class DoubleDottedEighthUnit extends BaseUnit {
  static name = 'eighth..';
}

export class TripletEighthUnit extends BaseUnit {
  static dots = 0;
  static tuplet = 3;
  static fraction = [ 1, 12 ];
  static name = "triplet-eighth";
  static shorthand = "te";
}

export class QuintupletEighthUnit extends BaseUnit {
  static dots = 0;
  static tuplet = 5;
  static fraction = [ 1, 10 ];
  static name = "quintuplet-eighth";
  static shorthand = "qe";
}

export class SeptupletEighthUnit extends BaseUnit {
  static dots = 0;
  static tuplet = 7;
  static fraction = [ 1, 14 ];
  static name = "septuplet-eighth";
  static shorthand = "se";
}