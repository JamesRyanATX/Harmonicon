import { BaseUnit } from './base.js';
import { DurationValue } from "@tonaljs/tonal";

export class EighthUnit extends BaseUnit {
  static definition = DurationValue.get('eighth');
}

export class DottedEighthUnit extends BaseUnit {
  static definition = DurationValue.get('eighth.');
}

export class DoubleDottedEighthUnit extends BaseUnit {
  static definition = DurationValue.get('eighth..');
}
