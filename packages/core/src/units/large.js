import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class LargeUnit extends BaseUnit {
  static definition = DurationValue.get('large');
}

export class DottedLargeUnit extends BaseUnit {
  static definition = DurationValue.get('large.');
}

export class DoubleDottedLargeUnit extends BaseUnit {
  static definition = DurationValue.get('large..');
}
