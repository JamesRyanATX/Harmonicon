import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class SixteenthUnit extends BaseUnit {
  static definition = DurationValue.get('sixteenth');
}

export class DottedSixteenthUnit extends BaseUnit {
  static definition = DurationValue.get('sixteenth.');
}

export class DoubleDottedSixteenthUnit extends BaseUnit {
  static definition = DurationValue.get('sixteenth..');
}
