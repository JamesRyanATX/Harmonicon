import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class ThirtySecondUnit extends BaseUnit {
  static definition = DurationValue.get('thirty-second');
}

export class DottedThirtySecondUnit extends BaseUnit {
  static definition = DurationValue.get('thirty-second.');
}

export class DoubleDottedThirtySecondUnit extends BaseUnit {
  static definition = DurationValue.get('thirty-second..');
}
