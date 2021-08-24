import { BaseUnit } from './base';
import { DurationValue } from "@tonaljs/tonal";

export class DoubleWholeUnit extends BaseUnit {
  static definition = DurationValue.get('double whole');
}

export class DottedDoubleWholeUnit extends BaseUnit {
  static definition = DurationValue.get('double whole.');
}

export class DoubleDottedDoubleWholeUnit extends BaseUnit {
  static definition = DurationValue.get('double whole..');
}
