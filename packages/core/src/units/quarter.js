import { BaseUnit } from './base.js';

export class QuarterUnit extends BaseUnit {
  static name = 'quarter';
}

export class DottedQuarterUnit extends BaseUnit {
  static name = 'quarter.';
}

export class DoubleDottedQuarterUnit extends BaseUnit {
  static name = 'quarter..';
}

export class TripletQuarterUnit extends BaseUnit {
  static name = 'triplet-quarter';
  static shorthand = 'tq';
  static fraction = [ 1, 3 ];
  static tuplet = 3;
  static dots = 0;
}

export class QuintupletQuarterUnit extends BaseUnit {
  static name = 'quintuplet-quarter';
  static shorthand = 'qq';
  static fraction = [ 1, 5 ];
  static tuplet = 5;
  static dots = 0;
}

export class SeptupletQuarterUnit extends BaseUnit {
  static name = 'septuplet-quarter';
  static shorthand = 'sq';
  static fraction = [ 1, 7 ];
  static tuplet = 7;
  static dots = 0;
}