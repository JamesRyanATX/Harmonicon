import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class LongUnit extends BaseUnit {
  static definition = DurationValue.get('long');
}

export class DottedLongUnit extends BaseUnit {
  static definition = DurationValue.get('long.');
}

export class DoubleDottedLongUnit extends BaseUnit {
  static definition = DurationValue.get('long..');
}
