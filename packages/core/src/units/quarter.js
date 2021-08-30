import { BaseUnit } from './base.js';
import { DurationValue } from "@tonaljs/tonal";

export class QuarterUnit extends BaseUnit {
  static definition = DurationValue.get('quarter');
}

export class DottedQuarterUnit extends BaseUnit {
  static definition = DurationValue.get('quarter.');
}

export class DoubleDottedQuarterUnit extends BaseUnit {
  static definition = DurationValue.get('quarter..');
}