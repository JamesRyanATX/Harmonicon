import { BaseUnit } from './base.js';
import { DurationValue } from "@tonaljs/tonal";

export class SixtyFourthUnit extends BaseUnit {
  static definition = DurationValue.get('sixty-fourth');
}

export class DottedSixtyFourthUnit extends BaseUnit {
  static definition = DurationValue.get('sixty-fourth.');
}

export class DoubleDottedSixtyFourthUnit extends BaseUnit {
  static definition = DurationValue.get('sixty-fourth..');
}
